import React from 'react';

function MediaLiteracy() {
    return (
        <div className="dashboard-page fade-in">
            <div className="admin-header">
                <h1>📚 Media Literacy Hub</h1>
                <p>Empowering you to navigate the digital information landscape.</p>
            </div>

            <div className="dashboard-grid admin-grid">
                {/* Why this matters */}
                <div className="dashboard-col full-width">
                    <div className="glass-card">
                        <h2 className="panel-title">🧠 Why This Matters</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                            In today's fast-paced digital world, misinformation spreads 6x faster than factual news.
                            Understanding how to critically evaluate content isn't just a skill—it's a necessity for
                            maintaining an informed society.
                        </p>
                        <div className="mini-stats-grid">
                            <div className="mini-stat glass-card" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                <span className="stat-value danger-text">64%</span>
                                <span className="stat-label">of people report encountering fake news daily</span>
                            </div>
                            <div className="mini-stat glass-card" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                <span className="stat-value" style={{ color: '#34d399' }}>85%</span>
                                <span className="stat-label">confidence boost after media literacy training</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How to spot misinformation */}
                <div className="dashboard-col full-width">
                    <h2 className="section-title">🔍 5 Signs of Potential Misinformation</h2>
                    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div className="activity-card glass-card">
                            <h3 className="item-title">1. Emotional Triggers</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Headlines designed to make you instantly angry or afraid are often manipulation tactics.
                            </p>
                        </div>
                        <div className="activity-card glass-card">
                            <h3 className="item-title">2. Missing Authors</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Reliable journalism usually has bylines. Anonymous "expert" sources are a red flag.
                            </p>
                        </div>
                        <div className="activity-card glass-card">
                            <h3 className="item-title">3. Absolute Claims</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Science is rarely 100% certain. Words like "miracle," "proven," and "undisputed" suggest hype.
                            </p>
                        </div>
                        <div className="activity-card glass-card">
                            <h3 className="item-title">4. Altered Media</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Images that look "too perfect" or have weird artifacts might be AI-generated or photoshopped.
                            </p>
                        </div>
                        <div className="activity-card glass-card">
                            <h3 className="item-title">5. Logical Fallacies</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Watch for "whataboutism," strawman arguments, and personal attacks instead of facts.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Tip */}
                {/* <div className="dashboard-col full-width">
                    <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                        <h3 className="panel-title">💡 Pro Tip: The SIFT Method</h3>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            <li><strong>S</strong>top. Don't share yet.</li>
                            <li><strong>I</strong>nvestigate the source. Is it reputable?</li>
                            <li><strong>F</strong>ind better coverage. What do other sources say?</li>
                            <li><strong>T</strong>race claims to the original context.</li>
                        </ul>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default MediaLiteracy;
