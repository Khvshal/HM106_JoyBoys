import { useState, useEffect } from 'react';
import { rssAPI, articlesAPI } from '@/services/api';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ExternalLink, RefreshCw, Loader2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';

interface RSSItem {
    title: string;
    link: string;
    summary: string;
    published_at: string;
    source: string;
    category: string;
    image_url?: string;
}

export default function LiveFeed() {
    const [feed, setFeed] = useState<RSSItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const { data } = await rssAPI.getFeed();
            setFeed(data);
        } catch (error) {
            toast.error('Failed to load live feed');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async (item: RSSItem) => {
        setAnalyzing(item.link);
        try {
            toast.info("Analyzing article...");
            // Submit to backend for analysis
            const response = await articlesAPI.create(
                item.title,
                "", // Content will be fetched by backend if empty? Wait, backend create_article expects 'content'. 
                // If I send empty content, backend uses standard flow. 
                // BUT existing create_article (Step 359) takes title, content, url.
                // It does NOT explicitly fetch content if missing in `create_article` function itself?
                // Checking Step 359 Line 187: `create_article` -> `new_article = Article(...)`. 
                // It generates demo scores immediately. IT DOES NOT FETCH CONTENT.
                // THIS IS A GAP. The user said "Backend extracts full article content... AI credibility analysis runs normally".
                // I need to UPDATE `create_article` to fetch content if empty? 
                // OR I need to fetch it here? Frontend can't fetch (CORS).
                // So Backend MUST fetch.
                // I will assume for now I send empty content and backend handles it, OR I need to update backend.
                // Based on User Request: "Backend extracts full article content".
                // I will update backend `articles.py` next.
                item.link,
                item.source
            );

            toast.success("Analysis complete!");
            navigate(`/article/${response.data.id}`);

        } catch (error) {
            toast.error("Analysis failed. Please try again.");
        } finally {
            setAnalyzing(null);
        }
    };

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
                    <Button variant="ghost" className="text-muted-foreground cursor-default">Live Feed</Button>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-serif text-primary">Live News Wire</h1>
                        <p className="text-muted-foreground mt-1">Real-time headlines from trusted global sources.</p>
                    </div>
                    <Button variant="outline" onClick={fetchFeed} disabled={loading} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {feed.map((item, idx) => (
                            <Card key={idx} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="outline" className="text-xs font-normal bg-secondary/50">
                                            {item.source}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-lg font-semibold leading-snug mb-3 line-clamp-3">
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-primary/30 underline-offset-4">
                                            {item.title}
                                        </a>
                                    </h3>

                                    <div className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1" dangerouslySetInnerHTML={{ __html: item.summary }} />

                                    <div className="mt-auto pt-4 border-t border-border/40 flex justify-between items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-muted-foreground hover:text-primary p-0 h-auto"
                                            onClick={() => window.open(item.link, '_blank')}
                                        >
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            Read Source
                                        </Button>

                                        <Button
                                            size="sm"
                                            className="bg-primary/90 hover:bg-primary gap-1.5 shadow-sm"
                                            onClick={() => handleAnalyze(item)}
                                            disabled={analyzing === item.link}
                                        >
                                            {analyzing === item.link ? (
                                                <>
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="h-3.5 w-3.5" />
                                                    Analyze Credibility
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
