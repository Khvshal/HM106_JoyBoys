import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { demoArticles, filterOptions } from "../data/articles";

function ArticleCard({ article, onAnalyze, isRss }) {
    const getStatusClass = (status) => {
        if (status === "high") return "status-reliable";
        if (status === "mixed") return "status-mixed";
        if (status === "pending") return "status-pending";
        return "status-misleading";
    };

    const getScoreColor = (score) => {
        if (score >= 70) return "#10b981";
        if (score >= 40) return "#f59e0b";
        if (score === 0) return "#9ca3af";
        return "#ef4444";
    };

    return (
        <div className="article-card">
            {article.thumbnail ? (
                <div className="article-image">
                    <img src={article.thumbnail} alt={article.headline} onError={(e) => e.target.style.display = 'none'} />
                </div>
            ) : (
                <div className="article-image-placeholder" style={{ backgroundColor: article.sourceColor + '40' }}>
                    <span style={{ fontSize: '2rem' }}>📰</span>
                </div>
            )}

            <div className="article-content">
                <div className="article-meta">
                    <span
                        className="article-source"
                        style={{ backgroundColor: article.sourceColor }}
                    >
                        {article.source}
                    </span>
                    <span className="article-time">🕐 {article.timestamp}</span>
                </div>

                <h3 className="article-headline">{article.headline}</h3>
                <p className="article-description">{article.description.replace(/<[^>]*>?/gm, "")}</p>

                <div className="article-footer">
                    {!isRss ? (
                        <div className="article-score">
                            <div
                                className="score-ring"
                                style={{
                                    background: `conic-gradient(${getScoreColor(article.trustScore)} ${article.trustScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                                }}
                            >
                                <span className="score-number">{article.trustScore}</span>
                            </div>
                            <div className="score-info">
                                <span className="score-title">Trust Score</span>
                                <span className={`score-status ${getStatusClass(article.status)}`}>
                                    {article.statusLabel}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="article-score">
                            <span className="score-status status-pending">Analysis Ready</span>
                        </div>
                    )}

                    <div className="article-stats">
                        <span>{isRss ? '📢 Live Feed' : `👍 ${article.likes}`}</span>
                    </div>
                </div>

                <button
                    className="btn-analyze"
                    onClick={() => onAnalyze(article)}
                >
                    {isRss ? 'Analyze Credibility →' : 'View Analysis →'}
                </button>
            </div>
        </div>
    );
}

function NewsFeed({ onAnalyzeArticle }) {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("rss");
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [customUrl, setCustomUrl] = useState("");

    // RSS Feed State
    const [rssArticles, setRssArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch RSS Data
    useEffect(() => {
        if (activeFilter === "rss") {
            const fetchRss = async () => {
                setLoading(true);
                try {
                    const response = await axios.get("http://localhost:8000/feed");
                    if (response.data.articles) {
                        setRssArticles(response.data.articles);
                    }
                } catch (err) {
                    console.error("Failed to fetch RSS feed:", err);
                    setError("Could not load live news. Using cached data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchRss();
        }
    }, [activeFilter]);

    const filteredArticles = useMemo(() => {
        if (activeFilter === "rss") return rssArticles;
        if (activeFilter === "all") return demoArticles;
        return demoArticles.filter(article => article.status === activeFilter);
    }, [activeFilter, rssArticles]);

    const handleAnalyze = (article) => {
        // For RSS items, we need to adapt the structure for the analyzer
        if (activeFilter === "rss") {
            onAnalyzeArticle({
                articleUrl: article.articleUrl,
                headline: article.headline,
                source: article.source
            });
        } else {
            onAnalyzeArticle(article);
        }
        navigate("/analyze");
    };

    const handleSubmitLink = () => {
        if (customUrl.trim()) {
            onAnalyzeArticle({
                articleUrl: customUrl,
                headline: "Custom Article",
                source: "User Submitted"
            });
            navigate("/analyze");
            setShowSubmitModal(false);
            setCustomUrl("");
        }
    };

    return (
        <div className="news-feed-page">
            {/* Page Header */}
            <div className="feed-header">
                <div>
                    <h1 className="feed-title">Global News Pulse</h1>
                    <p className="feed-subtitle">Real-time analysis from verified sources</p>
                </div>
                <div className="feed-actions">
                    <button
                        className="btn-filter"
                        onClick={() => setActiveFilter("all")}
                    >
                        🔽 Filter
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => setShowSubmitModal(true)}
                    >
                        Submit Link
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${activeFilter === "rss" ? "active" : ""}`}
                    onClick={() => setActiveFilter("rss")}
                    style={{ "--filter-color": "#3b82f6", borderColor: activeFilter === "rss" ? "#3b82f6" : "transparent" }}
                >
                    📡 Live Feed
                </button>
                {filterOptions.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-tab ${activeFilter === filter.id ? "active" : ""}`}
                        style={{
                            "--filter-color": filter.color,
                            borderColor: activeFilter === filter.id ? filter.color : "transparent"
                        }}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            {loading ? (
                <div className="loading-state">
                     <div className="spinner"></div>
                     <p>Fetching live news from global sources...</p>
                </div>
            ) : (
                <div className="articles-grid">
                    {filteredArticles.map(article => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onAnalyze={handleAnalyze}
                            isRss={activeFilter === "rss"}
                        />
                    ))}
                </div>
            )}

            {filteredArticles.length === 0 && (
                <div className="no-results">
                    <p>No articles match this filter.</p>
                </div>
            )}

            {/* Submit Link Modal */}
            {showSubmitModal && (
                <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Submit News Link</h2>
                        <p>Paste a news article URL to analyze its credibility</p>
                        <input
                            type="text"
                            placeholder="https://example.com/news-article..."
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            className="modal-input"
                        />
                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowSubmitModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleSubmitLink}
                                disabled={!customUrl.trim()}
                            >
                                Analyze
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsFeed;
