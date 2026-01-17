# HackMatrix Architecture & Status

## Overview
HackMatrix is a reliable news aggregation platform that uses a multi-factor credibility scoring engine to combat misinformation.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Python (FastAPI), SQLAlchemy, SQLite.
- **Authentication**: JWT, HTTP-only/Local storage flow.

## Core Features & Status

### 1. Verification & Scoring
- **Credibility Engine**: Implemented in Python. Scores based on Source Trust, NLP Analysis, Community Rating, and Cross-Source Corroboration (mocked).
- **Soft Lock**: Admin can "soft lock" suspicious articles (Implemented).

### 2. User Roles
- **Admin**: Dashboard with override capabilities, soft-lock, user flagging.
- **User**: Can rate articles, comment, and build credibility score.

### 3. Data Flow
- **Sources**: Managed via `sources.py` API.
- **Articles**: Ingested and scored.
- **Comments**: Basic implementation without voting (Backend gap).

## Project Structure
- `frontend_lovable/`: React application.
- `hackmatrix-backend/`: FastAPI application.
- `context/`: Documentation for AI Agents.

## API Documentation
- `/api/auth`: Login/Signup.
- `/api/articles`: management & rating.
- `/api/admin`: moderation tools.
- `/api/sources`: source metadata.
