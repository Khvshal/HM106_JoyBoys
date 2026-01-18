"""Admin dashboard routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from database import get_db
from models import User, Article, Report, AuditLog
from auth import get_current_user
from credibility_engine import CredibilityScoreManager

router = APIRouter()


def get_token_from_header(authorization: Optional[str] = Header(None)):
    """Extract token from Authorization header"""
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    return parts[1]


def check_admin(user: User):
    """Verify user is admin"""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Get admin dashboard stats"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    flagged_users = db.query(User).filter(User.is_flagged == True).count()
    
    total_articles = db.query(Article).count()
    soft_locked = db.query(Article).filter(Article.is_soft_locked == True).count()
    high_risk = db.query(Article).filter(Article.credibility_status == "High Risk").count()
    
    pending_reports = db.query(Report).filter(Report.is_resolved == False).count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "flagged": flagged_users
        },
        "articles": {
            "total": total_articles,
            "soft_locked": soft_locked,
            "high_risk": high_risk
        },
        "reports": {
            "pending": pending_reports
        }
    }


@router.get("/flagged-articles")
def get_flagged_articles(
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header),
    skip: int = 0,
    limit: int = 20
):
    """Get flagged/high-risk articles"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    articles = db.query(Article).filter(
        (Article.is_soft_locked == True) |
        (Article.credibility_status == "High Risk")
    ).order_by(Article.updated_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": a.id,
            "title": a.title,
            "source": a.source_name,
            "credibility_score": a.overall_credibility,
            "status": a.credibility_status,
            "is_soft_locked": a.is_soft_locked,
            "suspicious_activity": a.suspicious_activity_detected,
            "created_at": a.created_at,
            "reports_count": db.query(Report).filter(Report.article_id == a.id).count()
        }
        for a in articles
    ]


@router.post("/{article_id}/override-score")
def override_article_score(
    article_id: int,
    new_score: float,
    justification: str,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Admin override article credibility score"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Update score
    old_score = article.overall_credibility
    article.overall_credibility = new_score
    
    # Update status based on new score
    if new_score >= 70:
        article.credibility_status = "Widely Corroborated"
    elif new_score >= 45:
        article.credibility_status = "Under Review"
    else:
        article.credibility_status = "High Risk"
    
    # Log the override
    audit_log = AuditLog(
        article_id=article_id,
        old_score=old_score,
        new_score=new_score,
        reason=f"Admin override: {justification}",
        admin_id=user.id,
        is_admin_action=True
    )
    
    db.add(audit_log)
    db.commit()
    
    return {
        "status": "Score overridden",
        "article_id": article_id,
        "old_score": old_score,
        "new_score": new_score,
        "new_status": article.credibility_status
    }


@router.post("/{article_id}/remove-soft-lock")
def remove_soft_lock(
    article_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Remove soft lock from article"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    article.is_soft_locked = False
    article.soft_lock_reason = None
    article.suspicious_activity_detected = False
    
    db.commit()
    
    return {"status": "Soft lock removed", "article_id": article_id}


@router.post("/{article_id}/soft-lock")
def soft_lock_article(
    article_id: int,
    reason: str,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Apply soft lock to article"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    article.is_soft_locked = True
    article.soft_lock_reason = reason
    article.suspicious_activity_detected = True
    
    db.commit()
    
    return {"status": "Article soft locked", "article_id": article_id, "reason": reason}


@router.post("/user/{user_id}/flag")
def flag_user(
    user_id: int,
    reason: str,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Flag user for suspicious activity"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    target_user.is_flagged = True
    target_user.flag_reason = reason
    
    db.commit()
    
    return {"status": "User flagged", "user_id": user_id, "reason": reason}


@router.post("/user/{user_id}/unflag")
def unflag_user(
    user_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Remove flag from user"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    target_user.is_flagged = False
    target_user.flag_reason = None
    
    db.commit()
    
    return {"status": "User unflagged", "user_id": user_id}


@router.get("/pending-reports")
def get_pending_reports(
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header),
    skip: int = 0,
    limit: int = 20
):
    """Get pending reports for review"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    check_admin(user)
    
    reports = db.query(Report).filter(
        Report.is_resolved == False
    ).order_by(Report.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": r.id,
            "article_id": r.article_id,
            "article_title": r.article.title if r.article else None,
            "reporter_id": r.user_id,
            "report_type": r.report_type,
            "description": r.description,
            "created_at": r.created_at
        }
        for r in reports
    ]
