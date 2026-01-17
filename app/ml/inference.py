import os
import joblib

from .preprocess import clean_text
from .explain import (
    detect_hype_sentences,
    detect_factual_sentences,
    extract_top_keywords
)
from .scoring import final_credibility_score
from .governance.status import determine_status
from .governance.audit import generate_audit_log
from .url_extractor import is_url, extract_article_from_url


# -------------------------------------------------
# Load model & vectorizer safely (absolute paths)
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))


# -------------------------------------------------
# Main analysis function
# -------------------------------------------------

def analyze_article(text, spike_detected=False):
    """
    Analyze credibility of a news article using:
    - ML prediction
    - NLP explainability
    - governance logic
    
    If input is a URL, automatically fetches and extracts article content.
    """

    # 0. Check if input is a URL and extract article content
    if is_url(text):
        try:
            text = extract_article_from_url(text)
        except Exception:
            return {
                "error": "Unable to extract article from URL. Please paste article text manually."
            }

    # 1. Clean text
    cleaned_text = clean_text(text)

    # 2. ML prediction
    vector = vectorizer.transform([cleaned_text])
    prob = model.predict_proba(vector)[0]
    ml_score = prob[1] * 100

    # 3. NLP explainability
    hype_sentences = detect_hype_sentences(text)
    factual_sentences = detect_factual_sentences(text)
    keywords = extract_top_keywords(cleaned_text, vectorizer)

    # 4. Final credibility score
    final_score = final_credibility_score(
        ml_score,
        factual_sentences,
        hype_sentences
    )

    # 5. Credibility status
    status = determine_status(
        final_score,
        spike_detected=spike_detected
    )

    # 6. Audit trail
    audit_log = generate_audit_log(
        ml_score,
        len(factual_sentences),
        len(hype_sentences)
    )

    # 7. Human-readable label
    if final_score >= 70:
        label = "Likely Reliable"
    elif final_score >= 40:
        label = "Mixed Signals"
    else:
        label = "Potentially Misleading"

    # 8. Final response
    return {
        "credibility_score": round(final_score, 2),
        "status": status,
        "label": label,
        "article_text": text,  # Full article text for inline highlighting
        "details": {
            "ml_confidence": round(ml_score, 2),
            "keywords": keywords,
            "hype_sentences": hype_sentences,  # All sentences for highlighting
            "factual_sentences": factual_sentences,  # All sentences for highlighting
            "hype_count": len(hype_sentences),
            "factual_count": len(factual_sentences),
            "audit_log": audit_log
        }
    }
