from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Detect environment
IS_RENDER = os.getenv("RENDER") == "true"

if IS_RENDER:
    # 🚀 Production: PostgreSQL 
    DATABASE_URL = os.getenv("DATABASE_URL")

    if DATABASE_URL is None:
        raise RuntimeError("DATABASE_URL not set on Render")
    
    # SQLAlchemy requires 'postgresql://' instead of 'postgres://'
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    # Use psycopg2-binary
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

else:
    # 🧪 Local development: SQLite
    DATABASE_URL = "sqlite:///./hackmatrix.db"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
