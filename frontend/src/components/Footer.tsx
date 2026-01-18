import { Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-secondary/20 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Credibility Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <h3 className="font-semibold text-amber-900">About TruthLens Credibility Scores</h3>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                TruthLens provides <strong>credibility signals</strong>, not absolute truth. Our scores combine source trustworthiness, AI language analysis, community verification, and cross-source corroboration. We aim to help you make informed judgments, not to replace critical thinking.
                            </p>
                            <p className="text-xs text-amber-700 mt-2">
                                <strong>Our Commitment:</strong> All scoring algorithms are transparent and auditable. Score changes are logged with explanations. Community feedback shapes credibility through weighted voting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                                <Shield className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg font-serif">TruthLens</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Empowering media literacy through transparent, community-driven credibility assessment.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">News Feed</Link></li>
                            <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">My Profile</Link></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Transparency</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Scoring Methodology</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Ethics & Guidelines</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Audit Logs</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground">
                        © 2026 TruthLens • Built for SDG 16: Peace, Justice, and Strong Institutions
                    </p>
                </div>
            </div>
        </footer>
    );
}
