import { MOCK_USERS, MOCK_ACTIVITIES, MOCK_SUBMISSIONS } from "../data/mockData";

function UserDashboard() {
    const user = MOCK_USERS.USER;

    const getStatusColor = (status) => {
        switch (status) {
            case "Analyzed": return "status-success";
            case "Under Review": return "status-warning";
            case "Flagged": return "status-danger";
            default: return "";
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return "#10b981";
        if (score >= 40) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <div className="dashboard-page fade-in">
            {/* Welcome Section */}
            <div className="dashboard-header glass-card">
                <div className="user-profile-summary">
                    <img src={user.avatar} alt="Profile" className="profile-large" />
                    <div className="user-welcome-text">
                        <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                        <p>Track your verified news and contributions.</p>
                    </div>
                </div>

                <div className="trust-score-widget">
                    <div className="trust-label">Your Trust Score</div>
                    <div className="trust-value">{user.stats.trustScore}</div>
                    <div className="trust-level">High Credibility</div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Recent Activity Column */}
                <div className="dashboard-col">
                    <h2 className="section-title">🕒 Recent Activity</h2>
                    <div className="activity-list">
                        {MOCK_ACTIVITIES.map(activity => (
                            <div key={activity.id} className="activity-card glass-card">
                                <div className="activity-header">
                                    <span className="activity-source">{activity.source}</span>
                                    <span className="activity-date">{activity.date}</span>
                                </div>
                                <h3 className="activity-title">{activity.title}</h3>
                                <div className="activity-footer">
                                    <span className="sc-badge" style={{
                                        borderColor: getScoreColor(activity.score),
                                        color: getScoreColor(activity.score)
                                    }}>
                                        Score: {activity.score}
                                    </span>
                                    <span className="status-text">{activity.result}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submissions & Stats Column */}
                <div className="dashboard-col">
                    {/* Stats Cards */}
                    <div className="mini-stats-grid">
                        <div className="mini-stat glass-card">
                            <span className="stat-value">{user.stats.articlesAnalyzed}</span>
                            <span className="stat-label">Articles Analyzed</span>
                        </div>
                        <div className="mini-stat glass-card">
                            <span className="stat-value">{user.stats.savedArticles}</span>
                            <span className="stat-label">Contributions</span>
                        </div>
                    </div>

                    {/* Submissions Table */}
                    <div className="glass-card submissions-panel">
                        <h3 className="panel-title">📤 Submitted Links</h3>
                        <div className="table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>URL</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_SUBMISSIONS.map(sub => (
                                        <tr key={sub.id}>
                                            <td className="url-cell" title={sub.url}>{sub.url}</td>
                                            <td>
                                                <span className={`status-pill ${getStatusColor(sub.status)}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td>{sub.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Feedback Widget */}
                    <div className="glass-card feedback-widget">
                        <h3 className="panel-title">⭐ Rate CrediLens</h3>
                        <p>How accurate was your last analysis?</p>
                        <div className="rating-stars">
                            <button className="star-btn">★</button>
                            <button className="star-btn">★</button>
                            <button className="star-btn">★</button>
                            <button className="star-btn">★</button>
                            <button className="star-btn">★</button>
                        </div>
                        <textarea className="feedback-input" placeholder="Any feedback for us?"></textarea>
                        <button className="btn-secondary btn-sm">Submit Feedback</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
