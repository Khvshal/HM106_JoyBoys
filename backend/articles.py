"""Article management routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Article, Source, Rating, Comment, User, AuditLog, Claim
from schemas import ArticleCreate, ArticleResponse, ArticleDetailResponse, RatingCreate, CommentCreate, ReportCreate
from auth import get_current_user
from credibility_engine import CredibilityScoreManager, demo_article_scores

router = APIRouter()


def get_token_from_header(authorization: Optional[str] = Header(None)):
    """Extract token from Authorization header"""
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    return parts[1]


@router.get("/", response_model=List[ArticleResponse])
def get_articles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
    sort_by: str = "newest"
):
    """Get all articles with pagination"""
    query = db.query(Article)
    
    if sort_by == "credibility":
        query = query.order_by(Article.overall_credibility.desc())
    elif sort_by == "trending":
        # Articles with most activity (ratings + comments) in last 7 days
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        query = query.filter(Article.updated_at >= week_ago)
    else:  # newest
        query = query.order_by(Article.created_at.desc())
    
    articles = query.offset(skip).limit(limit).all()
    return articles


@router.get("/{article_id}", response_model=ArticleDetailResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get article detail"""
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Get additional stats
    ratings_count = db.query(Rating).filter(Rating.article_id == article_id).count()
    comments_count = db.query(Comment).filter(Comment.article_id == article_id).count()
    
    # Get audit logs
    audit_logs = db.query(AuditLog).filter(AuditLog.article_id == article_id).all()
    audit_data = [
        {
            "old_score": log.old_score,
            "new_score": log.new_score,
            "reason": log.reason,
            "created_at": log.created_at
        }
        for log in audit_logs
    ]
    
    response = ArticleDetailResponse(
        **ArticleResponse.from_orm(article).dict(),
        content=article.content,
        suspicious_activity_detected=article.suspicious_activity_detected,
        fact_opinion_ratio=article.fact_opinion_ratio,
        ratings_count=ratings_count,
        comments_count=comments_count,
        audit_logs=audit_data
    )
    
    return response


@router.post("/", response_model=ArticleResponse)
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(get_token_from_header)
):
    """Create a new article"""
    # Check for duplicates
    existing = db.query(Article).filter(Article.url == article.url).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Article URL already exists"
        )
    
    # Get or create source
    source = db.query(Source).filter(Source.name == article.source_name).first()
    if not source:
        source = Source(
            name=article.source_name,
            domain=article.source_name.replace(" ", "").lower() + ".com",
            url=article.source_name,
            credibility_score=50.0
        )
        db.add(source)
        db.flush()
    
    # Create article
    new_article = Article(
        title=article.title,
        content=article.content,
        url=article.url,
        source_id=source.id,
        source_name=article.source_name,
        published_date=article.published_date,
        is_user_submitted=bool(token),
        submitted_by_user_id=None
    )
    
    # If user submitted, get user ID
    if token:
        try:
            current_user = get_current_user(token, db)
            new_article.submitted_by_user_id = current_user.id
        except:
            pass  # Fallback if token invalid
    
    # Generate demo scores (no ML models yet)
    demo_scores = demo_article_scores()
    new_article.source_trust_score = demo_scores["source_trust_score"]
    new_article.nlp_score = demo_scores["nlp_score"]
    new_article.community_score = demo_scores["community_score"]
    new_article.cross_source_score = demo_scores["cross_source_score"]
    new_article.overall_credibility = demo_scores["overall_credibility"]
    new_article.credibility_status = "Under Review"
    
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    return new_article





@router.post("/{article_id}/rate")
def rate_article(
    article_id: int,
    rating_data: RatingCreate,
    request: Request,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Rate article credibility"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    current_user = get_current_user(token, db)
    rating_value = rating_data.rating_value
    
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check for existing rating from user
    existing_rating = db.query(Rating).filter(
        Rating.article_id == article_id,
        Rating.user_id == current_user.id
    ).first()
    
    client_ip = request.client.host if request.client else None
    
    if existing_rating:
        existing_rating.credibility_rating = rating_value
        existing_rating.ip_address = client_ip
    else:
        new_rating = Rating(
            article_id=article_id,
            user_id=current_user.id,
            credibility_rating=rating_value,
            vote_weight=1.0,
            ip_address=client_ip
        )
        db.add(new_rating)
    
    db.commit()
    
    # Recompute article scores
    score_manager = CredibilityScoreManager(db)
    score_manager.update_article_scores(article)
    
    return {"status": "Rating saved", "new_score": article.overall_credibility}


@router.post("/{article_id}/comment")
def comment_article(
    article_id: int,
    comment_data: CommentCreate,
    request: Request,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Comment on article"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
        
    reason = comment_data.reason
    explanation = comment_data.explanation
    
    current_user = get_current_user(token, db)
    
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    client_ip = request.client.host if request.client else None
    
    new_comment = Comment(
        article_id=article_id,
        user_id=current_user.id,
        reason=reason,
        explanation=explanation,
        ip_address=client_ip
    )
    
    db.add(new_comment)
    db.commit()
    
    return {"status": "Comment added", "comment_id": new_comment.id}


@router.post("/{article_id}/report")
def report_article(
    article_id: int,
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Report an article for issues"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
        
    current_user = get_current_user(token, db)
    
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    from models import Report
    
    new_report = Report(
        article_id=article_id,
        user_id=current_user.id,
        report_type=report_data.report_type,
        description=report_data.description
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return {"status": "Report submitted", "report_id": new_report.id}


@router.get("/{article_id}/comments")
def get_comments(article_id: int, db: Session = Depends(get_db), skip: int = 0, limit: int = 20):
    """Get comments for an article"""
    comments = db.query(Comment).filter(
        Comment.article_id == article_id,
        Comment.is_hidden == False
    ).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()
    
    return comments


@router.get("/{article_id}/ratings-breakdown")
def get_ratings_breakdown(article_id: int, db: Session = Depends(get_db)):
    """Get distribution of community ratings"""
    ratings = db.query(Rating).filter(Rating.article_id == article_id).all()
    
    if not ratings:
        return {
            "total_ratings": 0,
            "average_rating": 0,
            "distribution": {}
        }
    
    # Create bins: 0-20, 20-40, 40-60, 60-80, 80-100
    distribution = {
        "very_low": 0,      # 0-25
        "low": 0,           # 25-50
        "neutral": 0,       # 50-75
        "high": 0,          # 75-100
    }
    
    for rating in ratings:
        score = rating.credibility_rating
        if score < 25:
            distribution["very_low"] += 1
        elif score < 50:
            distribution["low"] += 1
        elif score < 75:
            distribution["neutral"] += 1
        else:
            distribution["high"] += 1
    
    avg_rating = sum(r.credibility_rating for r in ratings) / len(ratings)
    
    return {
        "total_ratings": len(ratings),
        "average_rating": round(avg_rating, 2),
        "distribution": distribution
    }
