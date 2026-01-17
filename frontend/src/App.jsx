import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import NewsFeed from "./components/NewsFeed";
import AnalyzePage from "./components/AnalyzePage";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import MediaLiteracy from "./components/MediaLiteracy";
import { MOCK_USERS } from "./data/mockData";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Handle role switching from Header
  const handleSwitchRole = (roleKey) => {
    const newUser = MOCK_USERS[roleKey];
    if (newUser) {
      setUser(newUser);
    }
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleAnalyzeArticle = (article) => {
    setSelectedArticle(article);
  };

  return (
    <Router>
      <div className="app">
        <Header
          user={user}
          onSwitchRole={handleSwitchRole}
          onSignOut={handleSignOut}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/feed"
              element={<NewsFeed onAnalyzeArticle={handleAnalyzeArticle} />}
            />
            <Route
              path="/analyze"
              element={<AnalyzePage selectedArticle={selectedArticle} />}
            />

            {/* Role Protected Routes */}
            <Route
              path="/dashboard"
              element={user?.role === "user" ? <UserDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/admin"
              element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route path="/literacy" element={<MediaLiteracy />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>© 2026 CrediLens by JoyBoys — Hackathon Project</p>
            <div className="footer-links">
              <span className="footer-link">Privacy</span>
              <span className="footer-link">Terms</span>
              <span className="footer-link">Contact</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
