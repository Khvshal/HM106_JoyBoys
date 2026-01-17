import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Star, LogOut, Shield, AlertTriangle, ExternalLink, MessageSquare, Flag } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { CommentSection } from '@/components/CommentSection';
import { VoteImpactIndicator } from '@/components/VoteImpactIndicator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import Cookies from 'js-cookie';
import { ReportModal } from '@/components/ReportModal';
import { Footer } from '@/components/Footer';
import { SoftLockBanner } from '@/components/SoftLockBanner';
import { ScoreExplainer } from '@/components/ScoreExplainer';
import { HypeHighlighter } from '@/components/HypeHighlighter';

interface Article {
  id: number;
  title: string;
  content: string;
  source_name: string;
  source_trust_score: number;
  nlp_score: number;
  community_score: number;
  cross_source_score: number;
  overall_credibility: number;
  credibility_status: string;
  is_soft_locked: boolean;
  soft_lock_reason?: string;
  suspicious_activity_detected: boolean;
  fact_opinion_ratio?: number;
  created_at: string;
}

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(50);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getById(parseInt(id!));
      setArticle(response.data);
    } catch (error: any) {
      toast.error('Failed to load article');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRateArticle = async () => {
    if (!user) {
      toast.error('Please login to rate');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await articlesAPI.rate(parseInt(id!), rating);
      toast.success('Rating submitted!');
      fetchArticle();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) return null;

  const breakdownData = [
    { name: 'Source Trust', value: article.source_trust_score, help: 'Based on historical accuracy and transparency' },
    { name: 'NLP Analysis', value: article.nlp_score, help: 'AI analysis of sensationalism and bias' },
    { name: 'Community', value: article.community_score, help: 'Weighted user ratings and feedback' },
    { name: 'Cross-Source', value: article.cross_source_score, help: 'Corroboration from other reliable sources' },
  ];

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 45) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-foreground">
      {/* Navbar - Simplified for Detail Page */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg font-serif tracking-tight">TruthLens</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/profile">
                    <Button variant="ghost" className="font-medium">{user.username}</Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link to="/login"><Button>Sign In</Button></Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Main Content Column (Left) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Article Header Card */}
            <div className="bg-background rounded-xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> Back
                </Link>
                <span>•</span>
                <span className="uppercase tracking-wider font-semibold text-primary">{article.source_name}</span>
                <span>•</span>
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold font-serif leading-tight mb-6 text-foreground">
                {article.title}
              </h1>

              {/* Status Band */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className={`px-3 py-1 text-sm font-medium border ${article.credibility_status === 'Widely Corroborated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  article.credibility_status === 'High Risk' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                  {article.credibility_status}
                </Badge>
                {article.is_soft_locked && (
                  <Badge variant="destructive" className="px-3 py-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Verification In Progress
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowReportModal(true)}
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report Issue
                </Button>
              </div>
            </div>

            {/* Soft Lock Banner */}
            {article.is_soft_locked && article.soft_lock_reason && (
              <SoftLockBanner reason={article.soft_lock_reason} showDetails={true} />
            )}

            {/* Content Area */}
            <Card className="border-border/60 shadow-sm">
              <CardContent className="pt-8 px-8 pb-8">
                <div className="prose prose-slate max-w-none prose-headings:font-serif prose-p:leading-loose prose-lg">
                  <HypeHighlighter content={article.content} />
                </div>
              </CardContent>
            </Card>

            {/* Community Discussion Area (Now prominent) */}
            <div className="bg-background rounded-xl border border-border/60 shadow-sm overflow-hidden" id="comments">
              <div className="px-6 py-4 border-b bg-secondary/30 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Community Verification
                </h3>
              </div>
              <div className="p-6">
                <CommentSection articleId={article.id} />
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (Right) - "Truth Dashboard" */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* Overall Score Card */}
              <Card className="border-border/60 shadow-md bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="flex items-center gap-2 text-primary font-serif">
                    <Shield className="h-5 w-5" fill="currentColor" className="text-primary/20" />
                    TruthLens Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-center">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    {/* Using Recharts Pie as a ring */}
                    <div className="h-40 w-40 flex items-center justify-center rounded-full border-8 border-secondary relative">
                      <span className={`text-5xl font-bold ${getCredibilityColor(article.overall_credibility)}`}>
                        {Math.round(article.overall_credibility)}
                      </span>
                      <span className="absolute -bottom-2 text-sm text-muted-foreground font-medium uppercase tracking-widest">Trust</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <ScoreExplainer />
                  </div>

                  <div className="space-y-4 text-left mt-4">
                    {breakdownData.map((item) => (
                      <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          {item.name}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 opacity-50 hover:opacity-100 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent><p className="w-48">{item.help}</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="font-mono font-medium">{item.value.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Fact vs Opinion Bar */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="text-emerald-700">Fact</span>
                      <span className="text-amber-700">Opinion</span>
                    </div>
                    <div className="h-2.5 bg-secondary rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(article.fact_opinion_ratio || 0.5) * 100}%` }}
                      />
                      <div
                        className="bg-amber-400 h-full flex-1"
                      />
                    </div>
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                      Content appears to be <strong>{Math.round((article.fact_opinion_ratio || 0.5) * 100)}% factual</strong>.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Card: Rate This */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    Verify This Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Your Assessment</label>
                        <span className="text-sm font-bold text-primary">{rating}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        disabled={!user || article.is_soft_locked}
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>Fake</span>
                        <span>Credible</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleRateArticle}
                      disabled={!user || submitting || article.is_soft_locked}
                    >
                      Submit Rating
                    </Button>
                    {!user && <p className="text-xs text-center text-rose-500">Log in to vote</p>}
                    {user && user.credibility_score !== undefined && (
                      <div className="mt-2 flex justify-center">
                        <VoteImpactIndicator
                          userCredibility={user.credibility_score}
                          votedUp={rating >= 60}
                          votedDown={rating < 40}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Source Card */}
              <div className="bg-card rounded-lg border p-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-lg font-bold font-serif text-primary">
                  {article.source_name.substring(0, 1)}
                </div>
                <div>
                  <div className="font-bold text-sm">{article.source_name}</div>
                  <div className="text-xs text-muted-foreground">Reliability: {article.source_trust_score.toFixed(1)}%</div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && article && (
        <ReportModal
          articleId={article.id}
          articleTitle={article.title}
          onClose={() => setShowReportModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
