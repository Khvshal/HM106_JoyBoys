import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MOCK_USERS } from "../data/mockData";

function Header({ user, onSwitchRole, onSignOut }) {
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showRoleMenu, setShowRoleMenu] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    <span className="logo-icon">🔍</span>
                    <span className="logo-text">CrediLens</span>
                </Link>

                {/* Navigation */}
                <nav className="nav-links">
                    <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                        Home
                    </Link>
                    <Link to="/feed" className={`nav-link ${isActive("/feed") ? "active" : ""}`}>
                        News Feed
                    </Link>
                    <Link to="/analyze" className={`nav-link ${isActive("/analyze") ? "active" : ""}`}>
                        Analyze
                    </Link>

                    {user?.role === "user" && (
                        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
                            Dashboard
                        </Link>
                    )}

                    {user?.role === "admin" && (
                        <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>
                            Admin Panel
                        </Link>
                    )}

                    <Link to="/literacy" className={`nav-link ${isActive("/literacy") ? "active" : ""}`}>
                        Learn
                    </Link>
                </nav>

                {/* Auth & Role Switcher Section */}
                <div className="auth-section">
                    {user ? (
                        <div className="user-menu">
                            <button
                                className="user-button"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <img src={user.avatar} alt="Avatar" className="user-avatar-img" />
                                <span className="user-name">{user.name}</span>
                                <span className="user-badge">{user.role}</span>
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            {showUserMenu && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        Signed in as <strong>{user.name}</strong>
                                    </div>
                                    <button className="dropdown-item" onClick={onSignOut}>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="role-switcher">
                            <button
                                className="btn-primary"
                                onClick={() => setShowRoleMenu(!showRoleMenu)}
                            >
                                Demo Login ▼
                            </button>
                            {showRoleMenu && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">Select Role</div>
                                    <button className="dropdown-item" onClick={() => onSwitchRole("USER")}>
                                        👤 Normal User
                                    </button>
                                    <button className="dropdown-item" onClick={() => onSwitchRole("ADMIN")}>
                                        🛡️ Admin
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;


