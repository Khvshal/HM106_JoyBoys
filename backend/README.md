# HackMatrix Backend

FastAPI-based backend for HackMatrix, a news credibility assessment platform.

## Tech Stack

- **Framework**: FastAPI (Python)
- **Database**: SQLite (via SQLAlchemy)
- **Authentication**: JWT (OAuth2PasswordBearer)
- **Validation**: Pydantic

## Key Features

- **Authentication**: Signup/Login with password hashing.
- **Articles**: CRUD operations, ingestion, and credibility scoring.
- **Sources**: Metadata management for news sources.
- **Users**: Profile management, credibility tracking, and role-based access (User/Admin).
- **Admin**: Dashboard stats, article soft-locking, and score overrides.
- **Credibility Engine**: Multi-factor scoring algorithm (Source Trust, NLP, Community, Cross-Reference).

## Setup

1.  **Create Virtual Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run Server**:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

## Project Structure

- `main.py`: Application entry point and router configuration.
- `models.py`: SQLAlchemy database models (`User`, `Article`, `Source`, etc.).
- `schemas.py`: Pydantic data schemas for requests/responses.
- `database.py`: Database connection and session management.
- `auth.py`: JWT token handling and user verification.
- `admin.py`: Admin-only endpoints.
- `articles.py`: Article management endpoints.
- `users.py`: User profile endpoints.
- `sources.py`: Source metadata endpoints.
- `credibility_engine.py`: Scoring logic.

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
