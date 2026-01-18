import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { articlesAPI } from '@/services/api';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogOut, Menu, X, Plus, Search, Shield, TrendingUp, Clock, Filter } from 'lucide-react';

import { Footer } from '@/components/Footer';
import { CategoryBadge } from '@/components/CategoryBadge';
import { SourceBadge } from '@/components/SourceBadge';
import { IngestionBadge } from '@/components/IngestionBadge';
import { ArticleCard } from '@/components/ArticleCard';

interface Article {
  id: number;
  title: string;
  source_name: string;
  overall_credibility: number;
  credibility_status: string;
  created_at: string;
  url: string;
  fact_opinion_ratio?: number;
  source_trust_score?: number;
  source_id?: number;
  category?: string;
  ingestion_type?: string;
  community_score?: number;
  nlp_score?: number;
  cross_source_score?: number;
};

export default function Index() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchArticles();
  }, [sortBy]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll(0, 20, sortBy);
      setArticles(response.data);
    } catch (error) {
      console.log('No articles yet - backend might not be running');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleSubmitArticle = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    try {
      await articlesAPI.create(
        formData.title,
        formData.content,
        formData.url,
        formData.source
      );
      toast.success('Article submitted successfully!');
      setShowSubmitForm(false);
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit article');
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 45) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navbar - Glassmorphism */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-primary font-serif">TruthLens</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/live-feed">
                <Button variant="ghost" className="font-medium text-primary hover:text-primary/80 hover:bg-primary/5">
                  Live Feed
                </Button>
              </Link>
              {user ? (
                <>
                  <Button
                    onClick={() => setShowSubmitForm(!showSubmitForm)}
                    className="gap-2 bg-accent hover:bg-accent/90 text-white border-0 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Verify News
                  </Button>
                  <Link to="/profile">
                    <Button variant="ghost" className="font-medium">{user.username}</Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="ghost">Admin</Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-primary text-white">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <Link to="/live-feed" className="mr-4 text-sm font-medium text-primary">Live Feed</Link>
            </div>

            {/* Mobile menu */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Hero / Submit Section */}
        {showSubmitForm && (
          <div className="mb-12 animate-slide-up">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-primary">Verify a Story</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  const formData = {
                    title: (e.currentTarget.elements.namedItem('title') as HTMLInputElement).value,
                    content: (e.currentTarget.elements.namedItem('content') as HTMLInputElement).value,
                    url: (e.currentTarget.elements.namedItem('url') as HTMLInputElement).value,
                    source: (e.currentTarget.elements.namedItem('source') as HTMLInputElement).value,
                  };
                  handleSubmitArticle(e, formData);
                }} className="space-y-4">
                  <Input name="title" placeholder="Headline" className="bg-white" required />
                  <textarea
                    name="content"
                    placeholder="Paste the article content here for AI analysis..."
                    className="w-full p-3 border rounded-lg min-h-[120px] bg-white focus:ring-2 focus:ring-accent/50 outline-none"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="url" placeholder="Source URL" type="url" className="bg-white" required />
                    <Input name="source" placeholder="Publisher Name (e.g. BBC)" className="bg-white" required />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="bg-primary">Start Analysis</Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowSubmitForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feed Controls */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
            <div>
              <h2 className="headline text-primary tracking-tight">Today's Briefing</h2>
              <p className="text-muted-foreground mt-1 text-lg">AI-verified news from around the world</p>
            </div>

            <div className="flex gap-2 glass-card p-1.5 rounded-xl">
              <Button
                variant={sortBy === 'newest' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('newest')}
                className={sortBy === 'newest' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-primary'}
              >
                <Clock className="h-4 w-4 mr-1.5" /> Latest
              </Button>
              <Button
                variant={sortBy === 'credibility' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('credibility')}
                className={sortBy === 'credibility' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-primary'}
              >
                <Shield className="h-4 w-4 mr-1.5" /> Credible
              </Button>
              <Button
                variant={sortBy === 'trending' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('trending')}
                className={sortBy === 'trending' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-primary'}
              >
                <TrendingUp className="h-4 w-4 mr-1.5" /> Trending
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Politics', 'Finance', 'Tech', 'Health', 'Sports'].map((cat) => (
              <Button
                key={cat}
                variant="outline"
                className={`rounded-full border px-4 h-9 font-medium transition-all ${(cat === 'All' && !articles[0]?.category) || articles.some(a => a.category === cat) // Simple active check logic placeholder
                  ? 'border-primary/20 bg-primary/5 text-primary'
                  : 'border-border/50 bg-background/50 hover:bg-background/80 text-muted-foreground'
                  }`}
                onClick={() => toast.info(`Filtering by ${cat} coming soon!`)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <div className="text-muted-foreground mb-4">No stories verified yet.</div>
            <Button onClick={() => setShowSubmitForm(true)}>Verify the first story</Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {articles.map((article) => (
              <div key={article.id} className="h-full">
                <ArticleCard
                  article={{
                    ...article,
                    id: String(article.id),
                    headline: article.title,
                    summary: '',
                    content: [], // Correct type
                    publishedAt: new Date(article.created_at),
                    source: {
                      id: String(article.source_id || 0),
                      name: article.source_name,
                      domain: '',
                      credibilityScore: article.source_trust_score || 0,
                      articlesPublished: 0,
                      reportFrequency: 0,
                      historicalTrend: []
                    },
                    credibilityScore: article.overall_credibility,
                    status: 'verified',
                    breakdown: {
                      sourceTrust: article.source_trust_score || 0,
                      communityScore: article.community_score || 0,
                      nlpAnalysis: article.nlp_score || 0,
                      crossSourceSupport: article.cross_source_score || 0
                    },
                    crossSources: [],
                    category: article.category || 'General'
                  }}
                  variant="default"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
