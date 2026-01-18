# 🎮 HackMatrix - Start Here! 

## ⚡ Super Quick Start (2 minutes)

### On Windows:
```bash
cd c:\Users\Admin\Downloads\Hackathon
run.bat
```

### On Mac/Linux:
```bash
cd ~/Downloads/Hackathon
chmod +x run.sh
./run.sh
```

**Wait 30 seconds...**

Then open your browser to: **http://localhost:5173**

---

## ✅ What You'll See

### Landing Page
- Feed of news articles
- Credibility score %
- Status badge (🟢🟡🔴)
- Sign In / Sign Up buttons

### First Time?
1. Click "Sign Up"
2. Create account (any email)
3. You're logged in!

### Try It Out
1. Click "Submit Article"
2. Fill in the form:
   ```
   Title: Breaking News: Climate Deal
   Content: Lorem ipsum...
   URL: https://example.com/article
   Source: BBC News
   ```
3. Click Submit
4. Article appears with credibility score!

### Click Any Article
1. See full details
2. Rate credibility (0-100%)
3. Add comment
4. See credibility breakdown chart

---

## 🔧 Manual Setup (If auto script fails)

### Terminal 1 - Backend (Python)
```bash
cd HackMatrix/hackmatrix-backend
python -m venv venv
venv\Scripts\activate     # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python main.py
```

Wait for: `INFO:     Uvicorn running on http://0.0.0.0:8000`

### Terminal 2 - Frontend (Node.js)
```bash
cd HackMatrix/frontend_lovable
npm install
npm run dev
```

Wait for: `Local: http://localhost:5173`

Then open browser: **http://localhost:5173**

---

## 📊 System Check

Before you start, verify:

```bash
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check Python
python --version
# Should show: Python 3.9+
```

If either is missing, install from:
- Node.js: https://nodejs.org/
- Python: https://www.python.org/

---

## 🎯 What's Working

✅ Create account
✅ Login/Logout
✅ Submit articles
✅ View article details
✅ Rate articles
✅ Comment on articles
✅ See credibility breakdown
✅ User profiles
✅ Admin dashboard (Functional)
✅ 20+ API endpoints

---

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs ← Try endpoints here!

---

## 💾 Test Data

Create an account:
- Email: `test@example.com`
- Password: `password123`

Then submit articles and rate them!

---

## 🐛 Common Issues

### "Connection refused" on frontend
- Backend not running?
- Check Terminal 1: Should see "Uvicorn running..."

### "npm not found"
- Node.js not installed
- Restart terminal after installing Node.js

### "python not found"
- Python not installed
- Use `python3` instead of `python` (Mac/Linux)

### Port 5173 already in use
```bash
# Find and kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

---

## 📖 Documentation

- **README.md** - Project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - What's implemented
- **API Docs** - http://localhost:8000/docs (interactive)

---

## 🎬 Demo Flow (5 minutes)

1. **Signup**: Sign up with test email ✅
2. **Submit**: Create an article ✅
3. **View**: Click article to see details ✅
4. **Rate**: Rate credibility 0-100% ✅
5. **Comment**: Add comment with reason ✅
6. **Chart**: See pie chart breakdown ✅
7. **Profile**: Click your name → profile page ✅
8. **Admin**: (If admin) Click "Admin" button ✅

---

## 🚀 Next Steps (After Running)

1. **Test the API**: Visit http://localhost:8000/docs
2. **Create test data**: Submit multiple articles
3. **Try admin**: Ask for admin account setup
4. **Deploy**: Follow README.md deployment section

---

## 💡 Tips

- **Use Incognito**: Test login/logout
- **Check Console**: F12 → Console tab for errors
- **API Explorer**: http://localhost:8000/docs has "Try it out" button
- **Create Multiple Accounts**: Test community voting

---

## 📝 Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind
- **Backend**: FastAPI + Python
- **Database**: SQLite (can upgrade to PostgreSQL)
- **Charts**: Recharts
- **Auth**: JWT tokens

---

## ✨ Key Features

### ⚙️ Credibility Scoring
4-factor algorithm:
- Source trust (30%)
- NLP analysis (25%)
- Community votes (30%)
- Cross-source verify (15%)

### 🔒 Security
- Password hashing (bcrypt)
- JWT authentication
- CORS protection

### 👥 Community
- User credibility profiles
- Weighted voting
- Community comments

### 🛡️ Protection
- Soft lock for suspicious activity
- Spam detection
- Admin moderation

---

## 🎓 Learning

Great to understand:
- FastAPI routing
- React hooks
- SQLAlchemy ORM
- JWT authentication

---

## 🎉 Ready?

Run this command and you're done:

**Windows:**
```
cd HackMatrix && run.bat
```

**Mac/Linux:**
```
cd HackMatrix && chmod +x run.sh && ./run.sh
```

Then open: **http://localhost:5173**

---

**Questions?** Check SETUP_GUIDE.md or README.md

**Let's go! 🚀**
