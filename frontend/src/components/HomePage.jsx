import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Verifying Reality in a <span className="gradient-text">Digital Age</span>
                    </h1>
                    <p className="hero-subtitle">
                        AI-powered credibility analysis for news articles. Detect misinformation,
                        identify bias, and make informed decisions about the content you consume.
                    </p>
                    <div className="hero-actions">
                        <Link to="/analyze" className="btn-primary btn-large">
                            🔍 Analyze Article
                        </Link>
                        <Link to="/feed" className="btn-secondary btn-large">
                            📰 Browse News Feed
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-card">
                        <div className="demo-score">
                            <div className="score-ring-large">
                                <span className="score-big">87</span>
                            </div>
                            <div className="score-details">
                                <span className="score-status-badge reliable">✓ Likely Reliable</span>
                                <p>Based on ML analysis and NLP signals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2 className="section-title">How It Works</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔗</div>
                        <h3>Paste URL or Text</h3>
                        <p>Simply paste a news article URL or the full text content for analysis</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI Analysis</h3>
                        <p>Our ML model analyzes language patterns, sources, and factual indicators</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Get Score</h3>
                        <p>Receive a credibility score with detailed breakdown of hype vs factual content</p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Articles Analyzed</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">95%</span>
                        <span className="stat-label">Accuracy Rate</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">50+</span>
                        <span className="stat-label">News Sources</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">&lt;3s</span>
                        <span className="stat-label">Analysis Time</span>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="cta-content">
                    <h2>Ready to verify the truth?</h2>
                    <p>Start analyzing articles now and make informed decisions</p>
                    <Link to="/analyze" className="btn-primary btn-large">
                        Get Started Free →
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
