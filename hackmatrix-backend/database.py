# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from dotenv import load_dotenv
# import os

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hackmatrix.db")

# # Use SQLite for development (no PostgreSQL setup needed)
# if DATABASE_URL.startswith("sqlite"):
#     engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# else:
#     engine = create_engine(DATABASE_URL)

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# Detect environment
IS_RENDER = os.getenv("RENDER") == "true"

if IS_RENDER:
    # 🚀 Production: PostgreSQL only
    DATABASE_URL = os.getenv("DATABASE_URL")

    if DATABASE_URL is None:
        raise RuntimeError("DATABASE_URL not set on Render")

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
