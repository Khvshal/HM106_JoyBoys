import os
import pickle
from .preprocess import clean_text

class NewsInference:
    def __init__(self, model_path=None, vectorizer_path=None):
        # Use absolute paths relative to this file
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        if model_path is None:
            model_path = os.path.join(base_dir, 'model.pkl')
        if vectorizer_path is None:
            vectorizer_path = os.path.join(base_dir, 'vectorizer.pkl')
            
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
            print(f"ML Models loaded successfully from {base_dir}")
        except Exception as e:
            self.model = None
            self.vectorizer = None
            print(f"Warning: Failed to load ML models from {base_dir}. using fallback heuristics. Error: {e}")

    def predict(self, text):
        if not self.model or not self.vectorizer:
            return {
                "prediction": 0,
                "confidence": 0.0,
                "label": "Error (Model not loaded)",
                "error": "Model not loaded"
            }
            
        cleaned_text = clean_text(text)
        features = self.vectorizer.transform([cleaned_text])
        prediction = self.model.predict(features)[0]
        probability = self.model.predict_proba(features)[0]
        
        return {
            "prediction": int(prediction),
            "confidence": float(max(probability)),
            "label": "Credible" if prediction == 1 else "Unreliable"
        }

    def extract_signals(self, text):
        """
        Heuristic method to identify hype and factual sentences.
        Returns: { "hype_sentences": [], "factual_sentences": [], "hype_count": 0, "factual_count": 0 }
        """
        import re
        
        # Split text into sentences (rudimentary)
        sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', text)
        
        hype_sentences = []
        factual_sentences = []
        
        hype_keywords = ["shocking", "bombshell", "destroyed", "eviscerated", "you won't believe", "miracle", "secret", "exposed", "shameful", "betrayal"]
        factual_keywords = ["according to", "reported by", "study shows", "data indicates", "percent", "%", "evidence", "confirmed", "official"]
        
        for sent in sentences:
            s_lower = sent.lower()
            
            # Hype detection
            if any(k in s_lower for k in hype_keywords) or (sent.isupper() and len(sent) > 20) or "!!!" in sent:
                hype_sentences.append(sent)
                continue
                
            # Factual detection
            if any(k in s_lower for k in factual_keywords) or re.search(r'\d+', sent): # Contains numbers
                factual_sentences.append(sent)
                
        return {
            "hype_sentences": hype_sentences,
            "factual_sentences": factual_sentences,
            "hype_count": len(hype_sentences),
            "factual_count": len(factual_sentences)
        }

if __name__ == "__main__":
    inf = NewsInference()
    result = inf.predict("New environmental policy passed by parliament.")
    print(result)
