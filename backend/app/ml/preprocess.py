import re
import string

def clean_text(text):
    """
    Basic text cleaning for NLP.
    """
    if not text:
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove numbers
    text = re.sub(r'\d+', '', text)
    
    # Remove extra whitespace
    text = text.strip()
    
    return text

if __name__ == "__main__":
    sample = "Breaking: 10 ways to spot FAKE news!!! @#$"
    print(f"Original: {sample}")
    print(f"Cleaned: {clean_text(sample)}")
