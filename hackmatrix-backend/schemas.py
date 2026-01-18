from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict

# ==================== User Schemas ====================
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    credibility_score: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfile(UserResponse):
    category_credibility: str
    is_flagged: bool


# ==================== Source Schemas ====================
class SourceCreate(BaseModel):
    name: str
    domain: str
    url: str
    description: Optional[str] = None

class SourceResponse(BaseModel):
    id: int
    name: str
    domain: str
    credibility_score: float
    articles_published: int
    corroboration_rate: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Article Schemas ====================
class ArticleCreate(BaseModel):
    title: str
    content: str
    url: str
    source_name: str
    published_date: Optional[datetime] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class CredibilityBreakdown(BaseModel):
    source_trust_score: float
    nlp_score: float
    community_score: float
    cross_source_score: float
    overall_credibility: float
    credibility_status: str

class ArticleResponse(BaseModel):
    id: int
    title: str
    url: str
    source_name: str
    published_date: Optional[datetime]
    is_user_submitted: bool
    category: Optional[str]
    
    source_trust_score: float
    nlp_score: float
    community_score: float
    cross_source_score: float
    overall_credibility: float
    credibility_status: str
    
    is_soft_locked: bool
    soft_lock_reason: Optional[str]
    
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ArticleListResponse(ArticleResponse):
    user_has_rated: bool = False
    user_credibility_rating: Optional[float] = None

    user_has_rated: bool = False
    user_credibility_rating: Optional[float] = None
    
    @classmethod
    def validate_json_fields(cls, v):
        # Allow Pydantic to do its thing, but if we get DB strings, parse them
        pass

    class Config:
        from_attributes = True

import json
from pydantic import validator

class ArticleDetailResponse(ArticleResponse):
    content: str
    hype_sentences: List[str] = []
    factual_sentences: List[str] = []
    suspicious_activity_detected: bool
    fact_opinion_ratio: float = 0.5
    ratings_count: int
    comments_count: int
    audit_logs: List[Dict]
    user_has_rated: bool = False
    user_credibility_rating: Optional[float] = None

    @validator('hype_sentences', 'factual_sentences', pre=True)
    def parse_json_list(cls, v):
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                return parsed if isinstance(parsed, list) else []
            except:
                return []
        return v if v is not None else []


# ==================== Rating/Comment Schemas ====================
class RatingCreate(BaseModel):
    rating_value: float  # 0-100 -- Frontend sends this key

class RatingResponse(BaseModel):
    id: int
    article_id: int
    user_id: int
    credibility_rating: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    reason: str  # predefined: credible, biased, outdated, misleading, unverified, spam
    explanation: Optional[str] = None

class CommentResponse(BaseModel):
    id: int
    article_id: int
    user_id: int
    reason: str
    explanation: Optional[str]
    created_at: datetime
    user: Optional[UserProfile] = None
    upvotes: int = 0
    downvotes: int = 0
    user_vote: int = 0  # 1, -1, or 0
    
    class Config:
        from_attributes = True


# ==================== Report Schemas ====================
class ReportCreate(BaseModel):
    report_type: str
    description: str

class ReportResponse(BaseModel):
    id: int
    article_id: int
    report_type: str
    description: str
    is_resolved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class CommentReportCreate(BaseModel):
    report_type: str
    description: str

class CommentReportResponse(BaseModel):
    id: int
    comment_id: int
    report_type: str
    description: str
    is_resolved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Claim Schemas ====================
class ClaimResponse(BaseModel):
    id: int
    claim_text: str
    entity: Optional[str]
    corroboration_count: int
    independent_sources: str
    
    class Config:
        from_attributes = True


# ==================== Auth Schemas ====================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
