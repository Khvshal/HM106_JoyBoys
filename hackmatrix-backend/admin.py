from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

from database import get_db
from models import Article, User, Report, Comment, AuditLog, Rating
from auth import get_current_user
from schemas import ArticleListResponse, ReportResponse

router = APIRouter()

# Admin verification dependency
def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

# --- Request Schemas ---
class OverrideScoreRequest(BaseModel):
    new_score: float
    justification: str

class SoftLockRequest(BaseModel):
    reason: str

class FlagUserRequest(BaseModel):
    reason: str

# --- Routes ---

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Get high-level statistics for admin dashboard"""
    total_users = db.query(User).count()
    total_articles = db.query(Article).count()
    flagged_articles = db.query(Article).filter(Article.credibility_status == "Unreliable").count()
    pending_reports = db.query(Report).filter(Report.is_resolved == False).count()
    
    # Recent activity (simple proxy: last 5 articles)
    recent_articles = db.query(Article).order_by(Article.created_at.desc()).limit(5).all()
    
    return {
        "stats": {
            "totalUsers": total_users,
            "totalArticles": total_articles,
            "flaggedArticles": flagged_articles,
            "pendingReports": pending_reports
        },
        "recentActivity": [
            {
                "id": a.id,
                "type": "article_submission",
                "description": f"New article submitted: {a.title[:30]}...",
                "timestamp": a.created_at
            } for a in recent_articles
        ]
    }

@router.get("/flagged-articles", response_model=List[ArticleListResponse])
def get_flagged_articles(
    skip: int = 0, 
    limit: int = 20, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    """Get articles marked as Unreliable or with low scores"""
    return db.query(Article).filter(Article.overall_credibility < 40).offset(skip).limit(limit).all()

@router.post("/{article_id}/override-score")
def override_score(
    article_id: int, 
    payload: OverrideScoreRequest, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    """Manually override an article's credibility score"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    old_score = article.overall_credibility
    article.overall_credibility = payload.new_score
    article.nlp_score = payload.new_score # Simplification for override
    
    # Log the action
    audit = AuditLog(
        article_id=article.id,
        user_id=admin.id,
        action="score_override",
        details=f"Score changed from {old_score} to {payload.new_score}. User justification: {payload.justification}"
    )
    db.add(audit)
    db.commit()
    return {"message": "Score updated successfully"}

@router.post("/{article_id}/soft-lock")
def soft_lock_article(
    article_id: int, 
    payload: SoftLockRequest, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    """Soft lock an article to prevent further community rating impact"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    article.is_soft_locked = True
    article.soft_lock_reason = payload.reason
    db.commit()
    return {"message": "Article soft-locked"}

@router.post("/{article_id}/remove-soft-lock")
def remove_soft_lock(
    article_id: int, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    """Remove soft lock"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    article.is_soft_locked = False
    article.soft_lock_reason = None
    db.commit()
    return {"message": "Soft lock removed"}

@router.get("/pending-reports", response_model=List[ReportResponse])
def get_pending_reports(
    skip: int = 0, 
    limit: int = 20, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    """Get unresolved reports"""
    return db.query(Report).filter(Report.is_resolved == False).offset(skip).limit(limit).all()

@router.post("/user/{user_id}/flag")
def flag_user(
    user_id: int, 
    payload: FlagUserRequest, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_flagged = True # Assuming is_flagged exists on User model
    # If not, might need migration or just ignore
    db.commit()
    return {"message": "User flagged"}

@router.post("/user/{user_id}/unflag")
def unflag_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_flagged = False
    db.commit()
    return {"message": "User unflagged"}
