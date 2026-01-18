# TruthLens ML Pipeline

This directory contains the machine learning components for news credibility evaluation.

## Files
- `preprocess.py`: Utilities for text cleaning and normalization.
- `train.py`: Script to train the Naive Bayes model on news datasets.
- `inference.py`: Production-ready class for making predictions on new articles.
- `model.pkl`: Serialized trained model.
- `vectorizer.pkl`: Serialized TF-IDF vectorizer.

## Usage
1. Prepare your training data in `train.py`.
2. Run `python train.py` to generate the `.pkl` artifacts.
3. Use `inference.py` within the FastAPI backend to serve predictions.
