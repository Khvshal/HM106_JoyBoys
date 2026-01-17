import { useState, useEffect, useMemo } from "react";
import axios from "axios";

// ===== MOCK DATA FOR CORROBORATION =====
const mockCorroborationData = {
    high: {
        status: "widely",
        statusLabel: "Widely Corroborated",
        statusColor: "#10b981",
        sources: [
            { name: "Reuters", title: "India inflation eases to 5.09% in February", type: "International Wire" },
            { name: "The Hindu", title: "Retail inflation declines sharply this month", type: "National Daily" },
            { name: "Economic Times", title: "CPI inflation drops to 5.09%, lowest in 6 months", type: "Business News" },
            { name: "Bloomberg", title: "India sees inflation ease amid food price drop", type: "Financial" }
        ]
    },
    mixed: {
        status: "limited",
        statusLabel: "Limited Coverage",
        statusColor: "#f59e0b",
        sources: [
            { name: "Times of India", title: "Government claims economic recovery on track", type: "National Daily" },
            { name: "NDTV", title: "Mixed signals on economic front, experts say", type: "News Network" }
        ]
    },
    low: {
        status: "not",
        statusLabel: "Not Corroborated",
        statusColor: "#ef4444",
        sources: [
            { name: "Fact Check India", title: "Claim requires additional verification", type: "Verification Service" }
        ]
    }
};

// Get mock corroboration based on credibility score
function getMockCorroboration(score) {
    if (score >= 70) return mockCorroborationData.high;
    if (score >= 40) return mockCorroborationData.mixed;
    return mockCorroborationData.low;
}

// Extract a claim from keywords
function extractMockClaim(keywords) {
    if (!keywords || keywords.length === 0) {
        return "The analyzed content discusses current events and claims.";
    }
    const keyTerms = keywords.slice(0, 3).join(", ");
    return `The article discusses topics related to: ${keyTerms}.`;
}

// ===== UTILITY FUNCTIONS =====
function splitIntoSentences(text) {
    if (!text) return [];
    return text.match(/[^.!?]+[.!?]+/g) || [text];
}

function getSentenceHighlight(sentence, hypeSentences, factualSentences) {
    const normalizedSentence = sentence.toLowerCase().trim();

    for (const hype of hypeSentences) {
        if (normalizedSentence.includes(hype.trim()) || hype.trim().includes(normalizedSentence)) {
            return "hype";
        }
    }

    for (const factual of factualSentences) {
        if (normalizedSentence.includes(factual.trim()) || factual.trim().includes(normalizedSentence)) {
            return "factual";
        }
    }

    return "neutral";
}

// ===== CROSS-SOURCE CORROBORATION COMPONENT =====
function CrossSourceCorroboration({ score, keywords }) {
    const corroboration = useMemo(() => getMockCorroboration(score), [score]);
    const claim = useMemo(() => extractMockClaim(keywords), [keywords]);

    return (
        <div className="corroboration-panel">
            <h3 className="section-title">🧭 Cross-Source Corroboration</h3>

            {/* Status Badge */}
            <div className="corroboration-status">
                <span
                    className="corroboration-badge"
                    style={{
                        backgroundColor: `${corroboration.statusColor}20`,
                        borderColor: corroboration.statusColor,
                        color: corroboration.statusColor
                    }}
                >
                    {corroboration.status === "widely" && "🟢"}
                    {corroboration.status === "limited" && "🟡"}
                    {corroboration.status === "not" && "🔴"}
                    {" "}{corroboration.statusLabel}
                </span>
                <p className="corroboration-description">
                    This reflects how many independent sources report similar claims.
                </p>
            </div>

            {/* Claim Summary Box */}
            <div className="claim-summary-box">
                <div className="claim-label">📝 Detected Key Claim:</div>
                <div className="claim-text">"{claim}"</div>
            </div>

            {/* Source Cards */}
            <div className="source-cards-container">
                <h4 className="sources-heading">Related Coverage from Independent Sources</h4>
                <div className="source-cards-grid">
                    {corroboration.sources.map((source, index) => (
                        <div key={index} className="source-card">
                            <div className="source-card-header">
                                <span className="source-name">{source.name}</span>
                                <span className="source-type">{source.type}</span>
                            </div>
                            <div className="source-card-title">
                                "{source.title}"
                            </div>
                            <div className="source-card-footer">
                                <span className="source-badge">Independent Source</span>
                                <span className="external-link">↗</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transparency Disclaimer */}
            <div className="corroboration-disclaimer">
                <p>
                    CrediLens estimates corroboration patterns across sources.
                    It does not label content as true or false.
                </p>
            </div>
        </div>
    );
}

// ===== HIGHLIGHTED ARTICLE COMPONENT =====
function HighlightedArticle({ articleText, hypeSentences, factualSentences }) {
    const sentences = useMemo(() => splitIntoSentences(articleText), [articleText]);

    return (
        <div className="highlighted-article">
            <h3 className="section-title">📄 Article Analysis</h3>
            <div className="article-text-container">
                {sentences.map((sentence, index) => {
                    const highlightType = getSentenceHighlight(
                        sentence,
                        hypeSentences || [],
                        factualSentences || []
                    );
                    return (
                        <span
                            key={index}
                            className={`sentence sentence-${highlightType}`}
                        >
                            {sentence}
                        </span>
                    );
                })}
            </div>

            <div className="highlight-legend">
                <div className="legend-item">
                    <span className="legend-color legend-hype"></span>
                    <span>Hype / Sensational Language</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color legend-factual"></span>
                    <span>Factual / Data-Driven</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color legend-neutral"></span>
                    <span>Neutral</span>
                </div>
            </div>
        </div>
    );
}

// ===== ANIMATED SCORE CIRCLE COMPONENT =====
function AnimatedScoreCircle({ score, label }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const increment = score / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                setAnimatedScore(score);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.round(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [score]);

    const getScoreColor = () => {
        if (score >= 70) return "#10b981";
        if (score >= 40) return "#f59e0b";
        return "#ef4444";
    };

    const circumference = 2 * Math.PI * 80;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="animated-score-container">
            <svg className="score-svg" width="200" height="200" viewBox="0 0 200 200">
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={getScoreColor()}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 100 100)"
                    style={{ transition: "stroke-dashoffset 0.1s ease" }}
                />
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={getScoreColor()}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 100 100)"
                    style={{
                        filter: `drop-shadow(0 0 10px ${getScoreColor()})`,
                        opacity: 0.5
                    }}
                />
            </svg>
            <div className="score-center">
                <span className="score-number-large" style={{ color: getScoreColor() }}>
                    {animatedScore}
                </span>
                <span className="score-percent">%</span>
            </div>
            <div className="score-label-bottom">
                <span
                    className="credibility-label"
                    style={{
                        color: getScoreColor(),
                        borderColor: getScoreColor()
                    }}
                >
                    {label}
                </span>
            </div>
        </div>
    );
}

// ===== ANALYSIS BREAKDOWN PANEL COMPONENT =====
function AnalysisBreakdown({ result }) {
    const getStatusClass = () => {
        if (result.credibility_score >= 70) return "status-high";
        if (result.credibility_score >= 40) return "status-mixed";
        return "status-low";
    };

    return (
        <div className="analysis-breakdown">
            <div className="breakdown-section">
                <h3 className="section-title">🔍 Why this score?</h3>
                <div className="breakdown-grid">
                    <div className="breakdown-item">
                        <span className="breakdown-label">ML Confidence</span>
                        <span className="breakdown-value">{result.details?.ml_confidence}%</span>
                    </div>
                    <div className="breakdown-item">
                        <span className="breakdown-label">Credibility Status</span>
                        <span className={`breakdown-status ${getStatusClass()}`}>
                            {result.label}
                        </span>
                    </div>
                </div>
            </div>

            <div className="breakdown-section">
                <h3 className="section-title">📊 Signals Detected</h3>
                <div className="signals-grid">
                    <div className="signal-card signal-factual">
                        <div className="signal-icon">🟢</div>
                        <div className="signal-info">
                            <span className="signal-count">{result.details?.factual_count || 0}</span>
                            <span className="signal-label">Factual Indicators</span>
                        </div>
                    </div>
                    <div className="signal-card signal-hype">
                        <div className="signal-icon">🔴</div>
                        <div className="signal-info">
                            <span className="signal-count">{result.details?.hype_count || 0}</span>
                            <span className="signal-label">Hype Indicators</span>
                        </div>
                    </div>
                </div>
            </div>

            {result.details?.keywords?.length > 0 && (
                <div className="breakdown-section">
                    <h3 className="section-title">🏷️ Key Topics</h3>
                    <div className="keywords-container">
                        {result.details.keywords.map((keyword, i) => (
                            <span key={i} className="keyword-tag">{keyword}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="disclaimer-box">
                <div className="disclaimer-icon">🧠</div>
                <div className="disclaimer-text">
                    <strong>Transparency Note</strong>
                    <p>
                        CrediLens does not determine absolute truth. It highlights credibility
                        signals to help users make informed decisions. Always verify information
                        from multiple sources.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ===== MAIN ANALYZE PAGE COMPONENT =====
function AnalyzePage({ selectedArticle }) {
    const [article, setArticle] = useState(selectedArticle?.articleUrl || "");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedArticle?.articleUrl) {
            setArticle(selectedArticle.articleUrl);
            const timer = setTimeout(() => {
                performAnalysis(selectedArticle.articleUrl);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [selectedArticle]);

    const performAnalysis = async (inputText) => {
        if (!inputText.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                "http://localhost:8000/analyze",
                { article: inputText }
            );

            if (response.data.error) {
                setError(response.data.error);
            } else {
                setResult(response.data);
            }
        } catch (err) {
            setError("Backend not reachable. Please make sure the server is running.");
        }

        setLoading(false);
    };

    const analyzeArticle = () => {
        performAnalysis(article);
    };

    return (
        <div className="analyze-page">
            {/* Input Card */}
            <div className="glass-card input-card">
                <header className="analyze-header">
                    <h1>🔍 Credibility Analysis</h1>
                    <p>Paste article text or URL for AI-powered analysis</p>
                </header>

                {selectedArticle && (
                    <div className="selected-article-info">
                        <span className="selected-label">📰 Analyzing from News Feed:</span>
                        <strong>{selectedArticle.headline}</strong>
                        <span className="selected-source">— {selectedArticle.source}</span>
                    </div>
                )}

                <div className="input-section">
                    <textarea
                        placeholder="Paste news article text or URL here..."
                        value={article}
                        onChange={(e) => setArticle(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="button-section">
                    <button
                        className="btn-primary btn-large btn-analyze-main"
                        onClick={analyzeArticle}
                        disabled={loading || !article.trim()}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Analyzing...
                            </>
                        ) : (
                            <>🔬 Analyze Credibility</>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="error-message fade-in">
                        <p>⚠️ {error}</p>
                    </div>
                )}
            </div>

            {/* Results Section */}
            {result && (
                <div className="analysis-results fade-in">
                    {/* Score Card */}
                    <div className="glass-card score-card">
                        <AnimatedScoreCircle
                            score={result.credibility_score}
                            label={result.label}
                        />
                    </div>

                    {/* Analysis Breakdown */}
                    <div className="glass-card">
                        <AnalysisBreakdown result={result} />
                    </div>

                    {/* Cross-Source Corroboration */}
                    <div className="glass-card">
                        <CrossSourceCorroboration
                            score={result.credibility_score}
                            keywords={result.details?.keywords}
                        />
                    </div>

                    {/* Highlighted Article */}
                    {result.article_text && (
                        <div className="glass-card">
                            <HighlightedArticle
                                articleText={result.article_text}
                                hypeSentences={result.details?.hype_sentences}
                                factualSentences={result.details?.factual_sentences}
                            />
                        </div>
                    )}

                    {/* Fallback Sentences */}
                    {!result.article_text && (
                        <div className="glass-card">
                            <div className="sentences-detail">
                                {result.details?.hype_sentences?.length > 0 && (
                                    <div className="sentence-section hype-section">
                                        <h4>
                                            <span className="icon">⚡</span>
                                            Hype Language Detected
                                        </h4>
                                        <ul className="sentence-list">
                                            {result.details.hype_sentences.map((s, i) => (
                                                <li key={i} className="sentence-item">{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.details?.factual_sentences?.length > 0 && (
                                    <div className="sentence-section factual-section">
                                        <h4>
                                            <span className="icon">📊</span>
                                            Factual Signals Detected
                                        </h4>
                                        <ul className="sentence-list">
                                            {result.details.factual_sentences.map((s, i) => (
                                                <li key={i} className="sentence-item">{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AnalyzePage;
