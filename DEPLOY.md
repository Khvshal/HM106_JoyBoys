# Deployment Guide for TruthLens (Fastest Way)

This guide takes ~10 minutes to deploy the full stack app for free.

## 1. Backend Deployment (Render.com)

Render is the easiest way to deploy Python FastAPI apps for free.

1.  **Push your code to GitHub** (if not already done).
2.  Go to [dashboard.render.com](https://dashboard.render.com/register).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `hackmatrix-backend`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    *   **Plan**: Free
6.  Click **Create Web Service**.
7.  Wait for deployment. Once live, copy the **URL** (e.g., `https://hackmatrix-backend.onrender.com`).

> **⚠️ Note on Database**: This deployment uses SQLite. On the free tier, Render restarts services occasionally, which **WILL WIPE your database**. For a hackathon demo, this is fine. For production, switch to PostgreSQL.

## 2. Frontend Deployment (Vercel)

Vercel is the fastest for React/Vite.

1.  Go to [vercel.com](https://vercel.com/signup).
2.  Click **Add New...** -> **Project**.
3.  Import the same GitHub repository.
4.  **Settings**:
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Root Directory**: `frontend_lovable` (Click Edit next to Root Directory).
    *   **Environment Variables**:
        *   Key: `VITE_API_URL`
        *   Value: `https://your-backend-url.onrender.com` (The URL from Step 1).
        *   *(Do NOT add trailing slash)*
5.  Click **Deploy**.
6.  Your frontend is live!

## 3. Local Demo (Alternative - "Zero Deploy")

If you just want to show it off *right now* without deploying:

1.  Install **ngrok** (https://ngrok.com/download).
2.  Start Backend: `./venv/Scripts/python -m uvicorn main:app --reload`
3.  Start Frontend: `npm run dev`
4.  Run ngrok for frontend: `ngrok http 8080` (or whatever port Vite uses).
5.  Share the ngrok link.
    *(Note: You might need to adjust `VITE_API_URL` or run ngrok for backend too if testing from outside network)*.

**Recommended**: Use Render + Vercel for a stable link to share with judges.
