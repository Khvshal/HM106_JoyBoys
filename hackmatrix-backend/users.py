"""User profile and credibility routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import User, Rating, Report, Comment
from schemas import UserProfile, UserResponse
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


@router.get("/profile", response_model=UserProfile)
def get_profile(
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Get current user profile"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    return UserProfile.from_orm(user)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user profile by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("/{user_id}/credibility-profile")
def get_credibility_profile(user_id: int, db: Session = Depends(get_db)):
    """Get user's credibility profile and history"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get stats
    total_ratings = db.query(Rating).filter(Rating.user_id == user_id).count()
    total_comments = db.query(Comment).filter(Comment.user_id == user_id).count()
    total_reports = db.query(Report).filter(Report.user_id == user_id).count()
    
    return {
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "credibility_score": user.credibility_score,
        "category_credibility": user.category_credibility,
        "is_flagged": user.is_flagged,
        "flag_reason": user.flag_reason,
        "activity": {
            "total_ratings": total_ratings,
            "total_comments": total_comments,
            "total_reports": total_reports,
        },
        "created_at": user.created_at
    }


@router.get("/{user_id}/ratings")
def get_user_ratings(
    user_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20
):
    """Get user's rating history"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    ratings = db.query(Rating).filter(Rating.user_id == user_id).order_by(
        Rating.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return [
        {
            "id": r.id,
            "article_id": r.article_id,
            "article_title": r.article.title if r.article else None,
            "credibility_rating": r.credibility_rating,
            "article_actual_score": r.article.overall_credibility if r.article else None,
            "rating_accuracy": abs(r.credibility_rating - r.article.overall_credibility) if r.article else None,
            "created_at": r.created_at
        }
        for r in ratings
    ]


@router.post("/recompute-credibility")
def recompute_credibility(
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    """Recompute current user's credibility score"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    user = get_current_user(token, db)
    
    score_manager = CredibilityScoreManager(db)
    new_score = score_manager.recompute_user_credibility(user)
    
    return {
        "user_id": user.id,
        "old_score": user.credibility_score,
        "new_score": new_score,
        "message": "Credibility score recomputed"
    }


@router.get("/")
def get_leaderboard(db: Session = Depends(get_db), limit: int = 20):
    """Get credibility leaderboard"""
    users = db.query(User).filter(User.is_active == True).order_by(
        User.credibility_score.desc()
    ).limit(limit).all()
    
    return [
        {
            "rank": idx + 1,
            "user_id": u.id,
            "username": u.username,
            "credibility_score": u.credibility_score,
            "role": u.role
        }
        for idx, u in enumerate(users)
    ]
