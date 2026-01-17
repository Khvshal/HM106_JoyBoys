import re
import nltk
from nltk.tokenize import sent_tokenize

# Download required NLTK data at import time
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)


# ----------------------------
# HYPE LANGUAGE DETECTION
# ----------------------------

HYPE_WORDS = [
    "shocking", "breaking", "unbelievable", "exposed",
    "secret", "must watch", "viral", "sensational",
    "outrage", "devastating", "truth revealed",
    "you won't believe", "alert"
]


def detect_hype_sentences(text):
    sentences = sent_tokenize(text.lower())
    hype_sentences = []

    for sent in sentences:
        for word in HYPE_WORDS:
            if word in sent:
                hype_sentences.append(sent)
                break

    return hype_sentences


# ----------------------------
# FACTUAL SIGNAL DETECTION
# ----------------------------

FACTUAL_PATTERNS = [
    r"\d+%",
    r"\b\d{4}\b",
    r"\baccording to\b",
    r"\breported by\b",
    r"\bdata shows\b",
    r"\bstudy\b",
    r"\bofficial\b",
    r"\bstatistics\b"
]


def detect_factual_sentences(text):
    sentences = sent_tokenize(text.lower())
    factual_sentences = []

    for sent in sentences:
        for pattern in FACTUAL_PATTERNS:
            if re.search(pattern, sent):
                factual_sentences.append(sent)
                break

    return factual_sentences


# ----------------------------
# KEYWORD EXTRACTION
# ----------------------------

def extract_top_keywords(text, vectorizer, top_n=8):
    tfidf_vector = vectorizer.transform([text])
    feature_names = vectorizer.get_feature_names_out()
    scores = tfidf_vector.toarray()[0]

    top_indices = scores.argsort()[-top_n:][::-1]
    return [feature_names[i] for i in top_indices if scores[i] > 0]
