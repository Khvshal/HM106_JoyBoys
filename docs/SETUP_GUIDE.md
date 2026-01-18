# HackMatrix - Complete Setup Guide

## 📋 System Requirements

Before you start, make sure you have:

1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version` (should be v18+)

2. **Python 3.9+**
   - Download: https://www.python.org/
   - Verify: `python --version` (should be 3.9+)

3. **Git** (optional, for cloning)
   - Download: https://git-scm.com/

---

## 🚀 Quick Start (Automated)

### Windows Users
```bash
cd HackMatrix
run.bat
```

### macOS/Linux Users
```bash
cd HackMatrix
chmod +x run.sh
./run.sh
```

This will:
- ✅ Create Python virtual environment
- ✅ Install all Python dependencies
- ✅ Install all npm packages
- ✅ Start backend on port 8000
- ✅ Start frontend on port 5173

**Once running:**
- 📱 Open http://localhost:5173 in your browser
- 🔌 Backend API at http://localhost:8000
- 📚 API Documentation at http://localhost:8000/docs

---

## 🔧 Manual Setup (Step by Step)

### Step 1: Backend Setup

```bash
# Navigate to backend folder
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

# Start the backend
python main.py
```

✅ **Backend is running at: http://localhost:8000**

**Check if it's working:**
- Open http://localhost:8000/docs in your browser
- You should see the interactive API documentation

### Step 2: Frontend Setup (in NEW terminal)

```bash
# Navigate to frontend folder
cd HackMatrix/frontend_lovable

# Install npm packages
npm install

# Start the frontend
npm run dev
```

✅ **Frontend is running at: http://localhost:5173**

---

## 🧪 Testing the Application

### Test 1: Create Account
1. Go to http://localhost:5173/signup
2. Create an account with test credentials:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. You'll be automatically logged in

### Test 2: Submit Article
1. Click "Submit Article" button on the home page
2. Fill in the form:
   - **Title**: "Breaking: New Climate Policy Announced"
   - **Content**: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
   - **URL**: "https://example.com/article"
   - **Source**: "BBC News"
3. Click "Submit"
4. Article appears in the feed with a credibility score!

### Test 3: Rate & Comment
1. Click on any article card to view details
2. Adjust the "Credibility Score" slider
3. Click "Submit Rating"
4. Go to "Add Comment" section
5. Select a reason (e.g., "Credible", "Biased", etc.)
6. Add your comment
7. Click "Post Comment"

### Test 4: Check API
- Open http://localhost:8000/docs
- Try out different endpoints
- Example: `GET /api/articles` to see all articles

---

## 📊 What's Already Built (50% Complete)

### ✅ Backend Features
- User Authentication (Signup/Login)
- Article Management (Create, Read, Update)
- Credibility Scoring Engine
- User Ratings System
- Comment System with Reasons
- Community-Weighted Voting
- Soft Lock Detection
- Admin Moderation Dashboard
- Audit Trail for Score Changes
- User Credibility Profiles

### ✅ Frontend Features
- Landing Page with Article Feed
- Article Detail Page with Breakdown
- Login/Signup Pages
- User Profile Page (Functional)
- Admin Dashboard (Functional)
- Real-time API Integration
- Responsive Design
- Interactive Credibility Chart

---

## 🔌 API Endpoints

### Health Check
```
GET http://localhost:8000/api/health
```

### Authentication
```
POST /api/auth/signup
  Body: { username, email, password }

POST /api/auth/login
  Body: { email, password }
```

### Articles
```
GET /api/articles?skip=0&limit=20&sort_by=newest

GET /api/articles/{id}

POST /api/articles
  Body: { title, content, url, source_name }

POST /api/articles/{id}/rate
  Body: { rating_value: 75 }

POST /api/articles/{id}/comment
  Body: { reason: "credible", explanation: "..." }

GET /api/articles/{id}/comments

GET /api/articles/{id}/ratings-breakdown
```

### Users
```
GET /api/users/profile

GET /api/users/{id}

GET /api/users/{id}/credibility-profile

GET /api/users (leaderboard)
```

### Admin
```
GET /api/admin/dashboard

GET /api/admin/flagged-articles

POST /api/admin/{id}/override-score
  Body: { new_score: 85, justification: "..." }
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure Python is 3.9+
python --version

# Reinstall requirements
pip install --upgrade pip
pip install -r requirements.txt

# Run with verbose output
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend won't load
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Try running with verbose output
npm run dev -- --debug
```

### Backend and frontend not communicating
1. Check that both are running:
   - Backend: http://localhost:8000/api/health
   - Frontend: http://localhost:5173
2. Check `frontend_lovable/.env` has correct API URL
3. Check browser console for CORS errors
4. Verify token is being saved in localStorage

### SQLite database errors
```bash
# Delete the old database
rm hackmatrix.db

# Start backend again - it will create a new one
python main.py
```

---

## 📁 Project Structure

```
HackMatrix/
├── hackmatrix-backend/          # FastAPI Backend
│   ├── main.py                  # Main app entry
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas
│   ├── database.py             # DB config
│   ├── credibility_engine.py   # Scoring logic
│   ├── auth.py                 # Auth endpoints
│   ├── articles.py             # Article endpoints
│   ├── users.py                # User endpoints
│   ├── admin.py                # Admin endpoints
│   ├── requirements.txt         # Python deps
│   ├── .env                    # Config file
│   └── hackmatrix.db           # SQLite database
│
├── frontend_lovable/            # React Frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Index.tsx       # Landing page
│   │   │   ├── ArticleDetail.tsx # Article page
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Signup.tsx       # Signup page
│   │   │   ├── UserProfile.tsx  # User profile
│   │   │   └── AdminDashboard.tsx
│   │   ├── components/         # UI components
│   │   ├── services/           # API services
│   │   │   └── api.ts          # Axios client
│   │   ├── App.tsx             # Main app
│   │   └── main.tsx            # Entry point
│   ├── package.json            # npm dependencies
│   ├── .env                    # Config file
│   └── tailwind.config.ts      # Tailwind config
│
├── ml_credibility/             # ML models (integrated)
│   └── backend/app/ml/         # ML modules
│
├── context/                    # Documentation
│   ├── project_description.txt
│   ├── ui_description.txt
│   ├── functionalities.txt
│   ├── techstack.txt
│   └── architechture.txt
│
├── README.md                   # Project overview
├── SETUP_GUIDE.md             # This file
├── run.bat                    # Windows quick start
└── run.sh                     # macOS/Linux quick start
```

---

## 🚀 Next Steps

### To Deploy:
1. **Backend**: Push to Render or Railway
2. **Frontend**: Push to Vercel
3. **Database**: Migrate to PostgreSQL on Supabase

### To Add Features:
1. Integrate ML models for NLP analysis
2. Add RSS feed aggregation
3. Implement WebSocket for real-time updates
4. Add email notifications

---

## 💡 Tips

1. **Use Incognito Window**: For testing login/logout
2. **Check Console**: Browser console shows API errors
3. **API Docs**: Visit http://localhost:8000/docs to explore endpoints
4. **Test Data**: Create multiple test accounts to test voting

---

## 📞 Need Help?

1. Check the README.md for overview
2. Review browser console for errors
3. Check backend terminal for server errors
4. Verify all ports are open (5173 and 8000)

---

## ✅ Quick Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Python 3.9+ installed (`python --version`)
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access API docs http://localhost:8000/docs
- [ ] Can create account on frontend
- [ ] Can submit article from frontend
- [ ] Article appears in feed with credibility score
- [ ] Can rate and comment on articles

---

Happy Coding! 🎉
