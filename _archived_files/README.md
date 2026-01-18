# HackMatrix - News Credibility Assessment Platform

A comprehensive platform for assessing the credibility of news articles using multi-factor scoring, community feedback, and AI-driven analysis.

## Project Status: 50% Functionality Implemented ✅

### What's Done:
- ✅ FastAPI Backend with full API structure
- ✅ Authentication (Login/Signup with JWT)
- ✅ Article Management (Create, Read, Rate, Comment)
- ✅ Credibility Scoring Engine (Multi-factor scoring)
- ✅ Admin Dashboard with moderation tools
- ✅ React + Vite Frontend with Tailwind CSS
- ✅ User Profiles and Credibility Tracking
- ✅ API integration with frontend

### Architecture:

```
HackMatrix/
├── hackmatrix-backend/  (FastAPI + Python)
│   ├── main.py          (Main FastAPI app)
│   ├── models.py        (SQLAlchemy ORM models)
│   ├── schemas.py       (Pydantic schemas)
│   ├── database.py      (DB config)
│   ├── credibility_engine.py (Scoring logic)
│   ├── auth.py          (Authentication routes)
│   ├── articles.py      (Article routes)
│   ├── users.py         (User routes)
│   ├── admin.py         (Admin routes)
│   ├── requirements.txt  (Python dependencies)
│   └── .env             (Environment variables)
│
├── frontend_lovable/    (React + Vite + TypeScript)
│   ├── src/
│   │   ├── pages/       (Page components)
│   │   ├── components/  (Reusable UI components)
│   │   ├── services/    (API service layer)
│   │   └── App.tsx      (Main app)
│   ├── package.json     (NPM dependencies)
│   └── .env             (Environment variables)
│
└── ml_credibility/      (ML models - integrated)
    └── backend/app/ml/  (Credibility models)
```

---

## 🚀 Quick Start Guide

### Prerequisites:
1. **Node.js** (v18+) - [Download](https://nodejs.org/)
2. **Python** (3.9+) - [Download](https://www.python.org/)
3. **Git** - [Download](https://git-scm.com/)

### Step 1: Install Backend Dependencies

```bash
cd HackMatrix/hackmatrix-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt
```

### Step 2: Start the Backend

```bash
# Make sure you're in hackmatrix-backend folder
python main.py

# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend should be running at: **http://localhost:8000**
📚 API docs at: **http://localhost:8000/docs**

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend_lovable

# Install npm packages
npm install
# or with yarn:
yarn install
# or with bun:
bun install
```

### Step 4: Start the Frontend

```bash
# Make sure you're in frontend_lovable folder
npm run dev
# or
yarn dev
# or
bun dev
```

✅ Frontend should be running at: **http://localhost:8080**

---

## 🧪 Testing the Application

### 1. Create an Account
- Go to http://localhost:5173/signup
- Sign up with test credentials

### 2. Create Articles
- Click "Submit Article" on landing page
- Fill in title, content, URL, and source name
- Articles appear in the feed with credibility scores

### 3. Rate & Comment
- Click on any article to view details
- Rate the article's credibility (0-100%)
- Add comments with structured reasons

### 4. Check Admin Dashboard
- Login with admin account (requires manual DB entry)
- Access /admin to view moderation tools

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify JWT token

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles/{id}` - Get article detail
- `POST /api/articles` - Submit new article
- `POST /api/articles/{id}/rate` - Rate article
- `POST /api/articles/{id}/comment` - Comment on article
- `GET /api/articles/{id}/comments` - Get comments
- `GET /api/articles/{id}/ratings-breakdown` - Get rating distribution

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/{id}` - Get user profile
- `GET /api/users/{id}/credibility-profile` - Get user credibility stats
- `GET /api/users/{id}/ratings` - Get user's rating history
- `GET /api/users` - Get credibility leaderboard

### Admin
- `GET /api/admin/dashboard` - Get admin stats
- `GET /api/admin/flagged-articles` - Get flagged articles
- `POST /api/admin/{id}/override-score` - Override article score
- `POST /api/admin/user/{id}/flag` - Flag suspicious user
- `GET /api/admin/pending-reports` - Get pending reports

---

## 🗄️ Database Schema

The application uses **SQLite** by default (stored as `hackmatrix.db`). Includes tables for:
- Users (with credibility scoring)
- Articles (with multi-factor scores)
- Ratings (user votes)
- Comments (community feedback)
- Sources (source credibility tracking)
- AuditLogs (transparent score changes)
- Claims (extracted for cross-source verification)
- Reports (community moderation)

---

## 🔧 Configuration

### Backend (.env)
```
DATABASE_URL=sqlite:///./hackmatrix.db  # or PostgreSQL URI
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

---

## 📱 Key Features Implemented

### 1. **Multi-Factor Credibility Scoring**
   - Source Trust Score (30% weight)
   - NLP Language Analysis (25% weight)
   - Community Feedback Score (30% weight)
   - Cross-Source Corroboration (15% weight)

### 2. **Community Trust System**
   - User credibility profiles
   - Vote weighting based on user reliability
   - Category-specific credibility tracking

### 3. **Anti-Manipulation Detection**
   - Soft lock articles with unusual activity
   - Spam detection (time-based spikes, new account activity)
   - Transparent banner showing verification status

### 4. **Admin Moderation**
   - Dashboard with system stats
   - Override scores with justification
   - Flag suspicious users
   - Review community reports

### 5. **Transparent Audit Trail**
   - Log every score change with reason
   - Show why an article is credible/risky
   - Full history accessible to users

---

## 🚀 Next Steps / Not Yet Implemented

1. **ML Integration** - Integrate ML models from ml_credibility repo for:
   - Sensationalism detection
   - Fact vs opinion analysis
   - Named entity extraction
   - Cross-source claim matching

2. **RSS Feed Aggregation** - Automatically fetch articles from:
   - BBC, Reuters, AP News, etc.
   - Real-time article updates

3. **Advanced NLP**
   - Sentiment analysis
   - Bias detection
   - Claim extraction and verification

4. **Deployment**
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel
   - Set up PostgreSQL on Supabase

5. **Real-time Updates**
   - WebSocket for live credibility score updates
   - Live comment feed

---

## 🐛 Troubleshooting

### Backend won't start
```
# Make sure Python 3.9+ is installed
python --version

# Reinstall requirements
pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend won't connect to backend
- Check that backend is running on port 8000
- Verify VITE_API_URL in .env is correct
- Check CORS settings in main.py

### Articles not showing
- Ensure SQLite database file exists
- Check browser console for API errors
- Verify token is being sent with requests

---

## 📚 Dependencies

### Backend (Python)
- FastAPI - Web framework
- SQLAlchemy - ORM
- Pydantic - Data validation
- PyJWT - JWT authentication
- bcrypt - Password hashing
- python-dotenv - Environment variables

### Frontend (Node.js)
- React 18 - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Recharts - Data visualization
- Axios - HTTP client
- React Router - Routing
- ShadCN UI - Component library

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 👥 Contributing

This is a hackathon project. For improvements or bug fixes, create a pull request or issue.

---

## 📞 Support

For issues or questions, check the GitHub repo or documentation above.

Happy analyzing! 🎉
