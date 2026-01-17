from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

# Many-to-many relationship for article-source cross-reference
article_source_association = Table(
    'article_source_association',
    Base.metadata,
    Column('article_id', Integer, ForeignKey('articles.id')),
    Column('source_id', Integer, ForeignKey('sources.id'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")  # user, trusted_user, admin
    
    # Credibility scores per category
    credibility_score = Column(Float, default=50.0)  # 0-100
    category_credibility = Column(String(500), default="{}")  # JSON: {"finance": 60, "health": 55}
    
    # Profile
    is_active = Column(Boolean, default=True)
    is_flagged = Column(Boolean, default=False)
    flag_reason = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ratings = relationship("Rating", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    reports = relationship("Report", back_populates="user")
    

class Source(Base):
    __tablename__ = "sources"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    domain = Column(String(100), unique=True, nullable=False)
    url = Column(String(255), nullable=False)
    
    # Credibility tracking
    credibility_score = Column(Float, default=50.0)  # 0-100
    articles_published = Column(Integer, default=0)
    corroboration_rate = Column(Float, default=0.5)  # 0-1
    
    logo_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    articles = relationship("Article", back_populates="source", secondary=article_source_association)


class StatusEnum(str, enum.Enum):
    under_review = "Under Review"
    widely_corroborated = "Widely Corroborated"
    high_risk = "High Risk"


class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    url = Column(String(500), unique=True, nullable=False)
    
    # Source info
    source_id = Column(Integer, ForeignKey('sources.id'))
    source_name = Column(String(100), nullable=False)
    published_date = Column(DateTime, nullable=True)
    
    # Submission type
    is_user_submitted = Column(Boolean, default=False)
    submitted_by_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    category = Column(String(50), default="General")
    
    # Credibility scores (breakdown)
    source_trust_score = Column(Float, default=50.0)
    nlp_score = Column(Float, default=50.0)  # Factuality/sensationalism analysis
    community_score = Column(Float, default=50.0)  # Weighted user ratings
    cross_source_score = Column(Float, default=50.0)  # Corroboration
    
    overall_credibility = Column(Float, default=50.0)  # Weighted average
    credibility_status = Column(String(50), default="Under Review")  # Under Review, Widely Corroborated, High Risk
    
    # Spam detection
    is_soft_locked = Column(Boolean, default=False)
    soft_lock_reason = Column(String(255), nullable=True)
    suspicious_activity_detected = Column(Boolean, default=False)
    
    # NLP Analysis details
    fact_opinion_ratio = Column(Float, default=0.5)  # 0.0 (opinion) to 1.0 (fact)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    source = relationship("Source", back_populates="articles", foreign_keys=[source_id])
    ratings = relationship("Rating", back_populates="article")
    comments = relationship("Comment", back_populates="article")
    reports = relationship("Report", back_populates="article")
    audit_logs = relationship("AuditLog", back_populates="article")
    claims = relationship("Claim", back_populates="article")


class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('articles.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Rating (1-5 scale or 0-100)
    credibility_rating = Column(Float)  # 0-100
    
    # Vote weight based on user credibility and category
    vote_weight = Column(Float, default=1.0)
    
    # Anti-Manipulation
    ip_address = Column(String(45), nullable=True)  # IPv4 or IPv6
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    article = relationship("Article", back_populates="ratings")
    user = relationship("User", back_populates="ratings")


class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('articles.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Comment content
    reason = Column(String(100), nullable=False)  # Predefined: credible, biased, outdated, misleading, etc.
    explanation = Column(Text, nullable=True)
    
    is_hidden = Column(Boolean, default=False)
    
    # Anti-Manipulation
    ip_address = Column(String(45), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    # Relationships
    article = relationship("Article", back_populates="comments")
    user = relationship("User", back_populates="comments")
    votes = relationship("CommentVote", back_populates="comment")
    
    # Vote cache (denormalized for performance)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)


class CommentVote(Base):
    __tablename__ = "comment_votes"
    
    id = Column(Integer, primary_key=True)
    comment_id = Column(Integer, ForeignKey('comments.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # 1 for upvote, -1 for downvote
    vote_value = Column(Integer, nullable=False)
    
    # Anti-Manipulation
    ip_address = Column(String(45), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    comment = relationship("Comment", back_populates="votes")
    user = relationship("User")


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('articles.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Report details
    report_type = Column(String(100), nullable=False)  # spam, misinformation, etc.
    description = Column(Text, nullable=False)
    
    is_resolved = Column(Boolean, default=False)
    resolution = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    article = relationship("Article", back_populates="reports")
    user = relationship("User", back_populates="reports")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('articles.id'), nullable=False)
    
    # What changed
    old_score = Column(Float, nullable=True)
    new_score = Column(Float, nullable=True)
    reason = Column(String(255), nullable=False)
    
    # Admin override
    admin_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    is_admin_action = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    article = relationship("Article", back_populates="audit_logs")


class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('articles.id'), nullable=False)
    
    # Claim extraction
    claim_text = Column(String(500), nullable=False)
    entity = Column(String(100), nullable=True)  # Named entity
    
    # Corroboration
    corroboration_count = Column(Integer, default=0)
    independent_sources = Column(String(500), default="[]")  # JSON: list of sources confirming this
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    article = relationship("Article", back_populates="claims")
