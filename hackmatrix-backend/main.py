from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from database import engine, SessionLocal
from models import Base, User
import bcrypt
import nltk_setup


load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Create default admin account
def create_admin_account():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@truthlens.com").first()
        
        # Also check for old email and update it
        old_admin = db.query(User).filter(User.email == "admin@hackmatrix.com").first()
        if old_admin and not admin:
            old_admin.email = "admin@truthlens.com"
            db.commit()
            print("✅ Admin email updated!")
            print("   Email: admin@truthlens.com")
            print("   Password: Admin@123")
            return
        
        if not admin:
            # Hash password
            password_hash = bcrypt.hashpw("Admin@123".encode(), bcrypt.gensalt()).decode()
            
            # Create admin user
            admin_user = User(
                username="admin",
                email="admin@truthlens.com",
                password_hash=password_hash,
                role="admin",
                is_active=True,
                credibility_score=100.0
            )
            db.add(admin_user)
            db.commit()
            print("✅ Default admin account created!")
            print("   Email: admin@truthlens.com")
            print("   Password: Admin@123")
        else:
            print("✅ Admin account already exists")
    except Exception as e:
        print(f"⚠️  Could not create admin account: {e}")
    finally:
        db.close()

create_admin_account()

# Create app
app = FastAPI(
    title="HackMatrix API",
    description="News Credibility Assessment Platform API",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8081",
    os.getenv("FRONTEND_URL", "https://hackmatrix-frontend.onrender.com")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/api/health")
@app.get("/api/health")
def health():
    return {"status": "Backend running!", "service": "HackMatrix API"}

@app.get("/")
def root():
    return {"message": "TruthLens API is Live! Check /api/health for status."}

# Import routers
from auth import router as auth_router
from articles import router as articles_router
from users import router as users_router
from admin import router as admin_router
from sources import router as sources_router

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(articles_router, prefix="/api/articles", tags=["Articles"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(sources_router, prefix="/api/sources", tags=["Sources"])

from rss import router as rss_router
app.include_router(rss_router, prefix="/api/rss", tags=["RSS"])

from comments import router as comments_router
app.include_router(comments_router, prefix="/api/comments", tags=["Comments"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
