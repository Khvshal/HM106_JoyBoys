
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from preprocess import clean_text

# 1. Load datasets
fake = pd.read_csv("D:\\HACKMATRIX\\backend\\app\\ml\\Fake.csv")
true = pd.read_csv("D:\\HACKMATRIX\\backend\\app\\ml\\True.csv")

# 2. Create labels
fake["label"] = 0   # fake
true["label"] = 1   # real

# 3. Combine datasets
data = pd.concat([fake, true], axis=0)

# 4. Combine title + text
data["content"] = data["title"] + " " + data["text"]

# 5. Clean text
data["content"] = data["content"].apply(clean_text)

X = data["content"]
y = data["label"]

# 6. Vectorization
vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=5000,
    ngram_range=(1, 2)
)

X_vec = vectorizer.fit_transform(X)

# 7. Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_vec, y)

# 8. Save model
joblib.dump(model, "model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("Model and vectorizer saved successfully.")











