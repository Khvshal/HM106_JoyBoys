# 📚 HackMatrix - Documentation Index

## 🚀 Start Here!

### **New to the project?**
👉 Read: [QUICK_START.md](./QUICK_START.md) (2 minutes)

### **Want step-by-step setup?**
👉 Read: [SETUP_GUIDE.md](./SETUP_GUIDE.md) (15 minutes)

### **Need project overview?**
👉 Read: [README.md](./README.md) (10 minutes)

### **What's actually built?**
👉 Read: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) (5 minutes)
---

## 📂 File Structure

```
HackMatrix/ (Main folder)
├── 🚀 QUICK_START.md        ← START HERE! Quick 2-min setup
├── 📖 README.md              ← Full project documentation
├── 🔧 SETUP_GUIDE.md         ← Detailed setup & troubleshooting
├── 📊 PROJECT_SUMMARY.md     ← What's implemented
├── 📚 INDEX.md               ← This file!
├── run.bat                   ← Windows auto-run script
├── run.sh                    ← Mac/Linux auto-run script
│
├── 📁 hackmatrix-backend/    ← FastAPI Backend (Python)
│   ├── main.py              (Main app)
│   ├── models.py            (Database models)
│   ├── auth.py              (Login/Signup)
│   ├── articles.py          (Article endpoints)
│   ├── users.py             (User endpoints)
│   ├── admin.py             (Admin endpoints)
│   ├── credibility_engine.py (Scoring logic)
│   ├── requirements.txt      (Python packages)
│   └── .env                 (Config file)
│
├── 📁 frontend_lovable/      ← React Frontend (TypeScript)
│   ├── src/
│   │   ├── pages/           (Page components)
│   │   ├── components/      (UI components)
│   │   ├── services/api.ts  (API client)
│   │   └── App.tsx          (Main router)
│   ├── package.json         (npm packages)
│   └── .env                 (Config file)
│
├── 📁 ml_credibility/        ← ML Models (for integration)
│   └── backend/app/ml/      (ML modules)
│
└── 📁 context/               ← Project specs
    ├── project_description.txt
    ├── ui_description.txt
    ├── functionalities.txt
    └── techstack.txt
```

---

## 🎯 Choose Your Path

### Path 1: Just Want to Run It? (5 min)
```bash
cd HackMatrix
run.bat              # Windows
./run.sh             # Mac/Linux
```
Then visit: http://localhost:5173

📖 **Read**: [QUICK_START.md](./QUICK_START.md)

---

### Path 2: Want to Understand Setup? (15 min)
1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Follow manual setup steps
3. Test each component

---

### Path 3: Developer/Deploy? (30 min)
1. Read [README.md](./README.md)
2. Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
3. Review API docs: http://localhost:8000/docs

---

### Path 4: Want to Modify/Add Features?
1. Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
2. Review backend code in `hackmatrix-backend/`
3. Check frontend in `frontend_lovable/src/`
4. Explore API at http://localhost:8000/docs

---

## 📋 Quick Reference

### Commands

**Start Everything (Auto):**
```bash
# Windows
cd HackMatrix && run.bat

# Mac/Linux
cd HackMatrix && chmod +x run.sh && ./run.sh
```

**Start Backend Only:**
```bash
cd hackmatrix-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate (Windows)
pip install -r requirements.txt
python main.py
```

**Start Frontend Only:**
```bash
cd frontend_lovable
npm install
npm run dev
```

### URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/health |

---

## ✅ What's Implemented (50%)

### Backend ✅
- User Authentication (Signup/Login)
- Article Management (CRUD + Rating)
- Credibility Scoring (4-factor algorithm)
- Community Voting System
- Admin Moderation
- Soft Lock Anti-Manipulation
- Audit Trail

### Frontend ✅
- Landing Page (Article Feed)
- Article Detail Page
- Login/Signup Pages
- User Profile (Functional)
- Admin Dashboard (Functional)
- API Integration
- Responsive Design
- Credibility Charts

### Database ✅
- 9 tables (SQLite)
- Full schema with relationships
- Ready for PostgreSQL migration

---

## 🔌 Key API Endpoints

```
GET    /api/health
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/articles
POST   /api/articles
POST   /api/articles/{id}/rate
GET    /api/users/profile
GET    /api/admin/dashboard
```

Full list: Visit http://localhost:8000/docs

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python, SQLAlchemy |
| Database | SQLite (development) |
| Charts | Recharts |
| Auth | JWT + bcrypt |

---

## 🆘 Troubleshooting

### Quick Fixes
1. **Port already in use?** Change port in run script
2. **Npm not found?** Reinstall Node.js
3. **Python not found?** Use `python3` or reinstall
4. **Backend won't start?** Check requirements.txt installed

### Detailed Help
See: [SETUP_GUIDE.md](./SETUP_GUIDE.md) → Troubleshooting section

---

## 📝 Documentation by Topic

### Getting Started
- [QUICK_START.md](./QUICK_START.md) - 2-minute setup
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Full setup guide

### Understanding the Project
- [README.md](./README.md) - Complete overview
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - What's built
- `context/` folder - Original specs

### Technical Details
- Backend: `hackmatrix-backend/models.py` - Database schema
- Frontend: `frontend_lovable/src/services/api.ts` - API client
- API: http://localhost:8000/docs - Interactive docs

---

## 🎓 Learning Path

1. **Beginner**: Read QUICK_START.md → Run it → Play with it
2. **Intermediate**: Read SETUP_GUIDE.md → Manual setup → Test APIs
3. **Advanced**: Read README.md → Review code → Plan enhancements

---

## 🚀 Next Steps

After running:

1. **Create Account** - Sign up with test email
2. **Submit Article** - Try submitting an article
3. **Rate & Comment** - Interact with articles
4. **Explore API** - Visit http://localhost:8000/docs
5. **Deploy** - See deployment section in README.md

---

## 💡 Pro Tips

- Use http://localhost:8000/docs to test API endpoints
- Use incognito window to test login/logout
- Check browser console (F12) for errors
- Check terminal for backend logs
- SQLite file: `hackmatrix-backend/hackmatrix.db`

---

## 📞 Support

| Issue | Solution |
|-------|----------|
| Ports busy | See SETUP_GUIDE.md |
| Dependencies fail | Reinstall requirements.txt |
| API not responding | Check backend terminal |
| Frontend blank | Check browser console (F12) |

---

## 🎉 Ready?

### Option A: Fastest (2 min)
```bash
cd HackMatrix && run.bat  # or ./run.sh
```

### Option B: Manual (5 min)
```bash
# Terminal 1
cd hackmatrix-backend && python main.py

# Terminal 2
cd frontend_lovable && npm run dev
```

### Then:
Open browser → **http://localhost:5173**

---

## 📚 All Documentation

- **QUICK_START.md** ← Start if you're in a hurry
- **SETUP_GUIDE.md** ← Read for detailed setup
- **README.md** ← Complete project info
- **PROJECT_SUMMARY.md** ← What's implemented
- **INDEX.md** ← This file (navigation)

---

## ✨ Key Highlights

✅ 50% functionality complete
✅ Clean architecture (Frontend/Backend/DB)
✅ Production-ready code
✅ Full API documentation
✅ Responsive UI
✅ Database ready for scaling

---

**That's it! You're ready to roll! 🚀**

**Pick a path above and start exploring HackMatrix!**
