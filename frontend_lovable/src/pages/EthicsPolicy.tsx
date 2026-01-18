import { Shield, Lock, Scale, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';

export default function EthicsPolicy() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                        <Shield className="h-6 w-6" />
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight text-primary font-serif">TruthLens</Link>
                </div>
                <div className="flex gap-4">
                    <Link to="/"><Button variant="ghost">Home</Button></Link>
                    <Link to="/how-it-works"><Button variant="ghost">How it Works</Button></Link>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 animate-fade-in">

                <section className="mb-12">
                    <h1 className="text-4xl font-bold font-serif text-primary mb-6">Ethics & Standards</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        TruthLens is built on the belief that access to accurate, unbiased information is a fundamental right.
                        Our automated systems and community guidelines are designed to uphold the highest standards of integrity.
                    </p>
                </section>

                <div className="space-y-8">
                    {/* Principle 1 */}
                    <div className="flex gap-6 items-start">
                        <div className="mt-1 bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
                            <Scale className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Neutral Point of View</h3>
                            <p className="text-muted-foreground">
                                Our algorithms are trained to identify bias, not to enforce one. We do not censor opinion, but we clearly label it.
                                Whether the content leans left, right, or center, our goal is to present the factual accuracy independent of political stance.
                            </p>
                        </div>
                    </div>

                    {/* Principle 2 */}
                    <div className="flex gap-6 items-start">
                        <div className="mt-1 bg-green-50 text-green-600 p-3 rounded-xl shrink-0">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                            <p className="text-muted-foreground">
                                We believe in showing our work. Every credibility score comes with a breakdown explaining
                                exactly why it was assigned. We maintain an audit log of all changes to article scores to prevent manipulation.
                            </p>
                        </div>
                    </div>

                    {/* Principle 3 */}
                    <div className="flex gap-6 items-start">
                        <div className="mt-1 bg-purple-50 text-purple-600 p-3 rounded-xl shrink-0">
                            <Lock className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Data Privacy</h3>
                            <p className="text-muted-foreground">
                                We respect user privacy. We do not sell user data to third parties.
                                Your reading history and voting patterns are used solely to improve your personalized feed and the accuracy of our system.
                            </p>
                        </div>
                    </div>

                    {/* Principle 4 */}
                    <div className="flex gap-6 items-start">
                        <div className="mt-1 bg-amber-50 text-amber-600 p-3 rounded-xl shrink-0">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Community Guidelines</h3>
                            <p className="text-muted-foreground">
                                Our community is our strength. We have zero tolerance for hate speech, harassment, or coordinated manipulation attempts.
                                Users found violating these standards will have their voting privileges revoked.
                            </p>
                        </div>
                    </div>
                </div>

                <section className="mt-16 bg-muted/30 p-8 rounded-2xl border border-border/50">
                    <h2 className="text-2xl font-bold font-serif mb-4">Report an Issue</h2>
                    <p className="text-muted-foreground mb-6">
                        If you encounter content that violates our ethics guidelines or notice an error in our algorithmic assessment,
                        please use the "Report" feature available on every article and comment.
                    </p>
                    <Link to="/">
                        <Button variant="outline">Return to Feed</Button>
                    </Link>
                </section>

            </main>
            <Footer />
        </div>
    );
}
