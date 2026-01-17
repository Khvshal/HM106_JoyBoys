import { useState } from "react";
import { ADMIN_STATS, MOCK_SOURCES, FLAGGED_CONTENT } from "../data/mockData";

function AdminDashboard() {
    const [sources, setSources] = useState(MOCK_SOURCES);
    const [flagged, setFlagged] = useState(FLAGGED_CONTENT);

    const handleReview = (id) => {
        // Simulate reviewing content
        setFlagged(flagged.filter(item => item.id !== id));
        alert("Content marked as reviewed!");
    };

    const getSourceStatusColor = (status) => {
        switch (status) {
            case "Trusted": return "status-success";
            case "Watchlist": return "status-warning";
            case "Banned": return "status-danger";
            default: return "";
        }
    };

    return (
        <div className="dashboard-page fade-in">
            <header className="admin-header">
                <h1>🛡️ Admin Command Center</h1>
                <p>Monitor platform health and counter misinformation.</p>
            </header>

            {/* Analytics Overview */}
            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <h3>Total Analyzed</h3>
                    <div className="stat-number">{ADMIN_STATS.totalArticles}</div>
                    <div className="stat-trend">↗ +12% this week</div>
                </div>
                <div className="stat-card glass-card">
                    <h3>High Risk Detected</h3>
                    <div className="stat-number danger-text">{ADMIN_STATS.highRiskDetected}</div>
                    <div className="stat-trend">↘ -5% this week</div>
                </div>
                <div className="stat-card glass-card">
                    <h3>Active Sources</h3>
                    <div className="stat-number">{MOCK_SOURCES.length}</div>
                    <div className="stat-trend">Tracked daily</div>
                </div>
                <div className="stat-card glass-card">
                    <h3>User Reports</h3>
                    <div className="stat-number warning-text">{ADMIN_STATS.recentReports}</div>
                    <div className="stat-trend">Needs attention</div>
                </div>
            </div>

            <div className="dashboard-grid admin-grid">
                {/* Flagged Content Review */}
                <div className="dashboard-col full-width">
                    <div className="glass-card">
                        <div className="panel-header">
                            <h2 className="panel-title">🚩 Pending Content Review</h2>
                            <span className="badge-count">{flagged.length}</span>
                        </div>

                        {flagged.length === 0 ? (
                            <div className="empty-state">No pending items to review. Good job! 🎉</div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Article</th>
                                            <th>Source</th>
                                            <th>Reports</th>
                                            <th>Claims Detected</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flagged.map(item => (
                                            <tr key={item.id}>
                                                <td className="title-cell">
                                                    <div className="item-title">{item.title}</div>
                                                    <div className="item-date">{item.date}</div>
                                                </td>
                                                <td>{item.source}</td>
                                                <td>{item.reports}</td>
                                                <td className="claims-cell">{item.claims}</td>
                                                <td>
                                                    <button
                                                        className="btn-primary btn-sm"
                                                        onClick={() => handleReview(item.id)}
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Source Management */}
                <div className="dashboard-col full-width">
                    <div className="glass-card">
                        <h2 className="panel-title">🌐 Source Reputation Network</h2>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Source Name</th>
                                        <th>Type</th>
                                        <th>Trust Score</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sources.map(source => (
                                        <tr key={source.id}>
                                            <td className="source-name-cell">{source.name}</td>
                                            <td>{source.type}</td>
                                            <td>
                                                <div className="score-bar-container">
                                                    <div
                                                        className="score-bar"
                                                        style={{
                                                            width: `${source.score}%`,
                                                            backgroundColor: source.score > 80 ? '#10b981' : source.score > 50 ? '#f59e0b' : '#ef4444'
                                                        }}
                                                    ></div>
                                                    <span>{source.score}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${getSourceStatusColor(source.status)}`}>
                                                    {source.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-text">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
