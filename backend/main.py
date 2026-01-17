from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


from app.ml.inference import analyze_article

app = FastAPI(
    title="Credilens Backend",
    description="Backend service for AI-based news credibility analysis",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class ArticleRequest(BaseModel):
    article: str


@app.post("/analyze")
def analyze_news(request: ArticleRequest):
    result = analyze_article(request.article)
    return result
