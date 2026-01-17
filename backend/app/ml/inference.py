import pickle
from preprocess import clean_text

class NewsInference:
    def __init__(self, model_path='model.pkl', vectorizer_path='vectorizer.pkl'):
        try:
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
        except FileNotFoundError:
            self.model = None
            self.vectorizer = None
            print("Warning: Model or Vectorizer files not found. Run train.py first.")

    def predict(self, text):
        if not self.model or not self.vectorizer:
            return {"error": "Model not loaded."}
            
        cleaned_text = clean_text(text)
        features = self.vectorizer.transform([cleaned_text])
        prediction = self.model.predict(features)[0]
        probability = self.model.predict_proba(features)[0]
        
        return {
            "prediction": int(prediction),
            "confidence": float(max(probability)),
            "label": "Credible" if prediction == 1 else "Unreliable"
        }

if __name__ == "__main__":
    inf = NewsInference()
    result = inf.predict("New environmental policy passed by parliament.")
    print(result)
