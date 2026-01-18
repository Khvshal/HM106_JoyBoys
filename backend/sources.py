"""Sources API routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Source, Article
from auth import get_current_user
from schemas import SourceResponse

router = APIRouter()

@router.get("/{source_id}", response_model=SourceResponse)
def get_source(source_id: int, db: Session = Depends(get_db)):
    """Get source by ID"""
    source = db.query(Source).filter(Source.id == source_id).first()
    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source not found"
        )
    return source

@router.get("/", response_model=List[SourceResponse])
def get_sources(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all sources"""
    sources = db.query(Source).offset(skip).limit(limit).all()
    return sources
