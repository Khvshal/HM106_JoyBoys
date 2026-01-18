import { Shield, Search, Database, Users, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
            {/* Navbar Placeholder - Should be reusable but for now simple header */}
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                        <Shield className="h-6 w-6" />
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight text-primary font-serif">TruthLens</Link>
                </div>
                <div className="flex gap-4">
                    <Link to="/"><Button variant="ghost">Home</Button></Link>
                    <Link to="/ethics"><Button variant="ghost">Ethics</Button></Link>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 animate-fade-in">

                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary mb-6">How TruthLens Works</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We combine advanced AI analysis with community verification to bring transparency to the news ecosystem.
                    </p>
                </section>

                {/* The 4 Core Pillars */}
                <section className="grid md:grid-cols-2 gap-8 mb-20">
                    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Database className="h-6 w-6" />
                            </div>
                            <CardTitle>1. Source Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                We evaluate the historical reliability of the publisher. Our database tracks retraction rates, bias patterns, and ownership transparency to establish a baseline trust score for every source.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Search className="h-6 w-6" />
                            </div>
                            <CardTitle>2. NLP Content Screening</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Our AI analyzes the text for sensationalism, emotional manipulation, and logical fallacies. It flags loaded language and unsupported claims that indicate potential bias or misinformation.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <CardTitle>3. Cross-Reference</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                We verify facts against a network of trusted independent sources. If a story is reported by multiple high-credibility outlets with matching details, its score increases.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6" />
                            </div>
                            <CardTitle>4. Community Verification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Verified users can rate stories and flag issues. Our "wisdom of the crowd" system allows experts to provide context, ensuring the AI is kept in check by human oversight.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* The Score Explained */}
                <section className="bg-secondary/30 rounded-2xl p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold font-serif mb-8 text-center">Understanding the Score</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center text-2xl font-bold text-emerald-600 mb-4 bg-white shadow-sm">
                                80+
                            </div>
                            <h3 className="font-semibold text-lg mb-2">High Credibility</h3>
                            <p className="text-sm text-muted-foreground">
                                Verified sources, neutral tone, and corroborated facts. Safe to trust.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full border-4 border-amber-500 flex items-center justify-center text-2xl font-bold text-amber-600 mb-4 bg-white shadow-sm">
                                50-79
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Mixed Credibility</h3>
                            <p className="text-sm text-muted-foreground">
                                May contain opinion, slight bias, or unverified claims. Read with a critical eye.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full border-4 border-rose-500 flex items-center justify-center text-2xl font-bold text-rose-600 mb-4 bg-white shadow-sm">
                                &lt;50
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Low Credibility</h3>
                            <p className="text-sm text-muted-foreground">
                                High risk of misinformation, clickbait, or propaganda. Verify independently.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="text-center">
                    <Link to="/">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Explore the Feed
                        </Button>
                    </Link>
                </div>

            </main>
            <Footer />
        </div>
    );
}
