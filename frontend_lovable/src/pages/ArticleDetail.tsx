import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Star, LogOut, Shield, AlertTriangle, ExternalLink, MessageSquare, Flag, Clock } from 'lucide-react';
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
  user_has_rated?: boolean;
  user_credibility_rating?: number;
  audit_logs?: any[];
  hype_sentences?: string[];
  factual_sentences?: string[];
}

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(50);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article?.user_credibility_rating) {
      setRating(article.user_credibility_rating);
    }
  }, [article]);

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
    if (score >= 70) return 'text-emerald-700'; // Darker for readability
    if (score >= 45) return 'text-amber-700';
    return 'text-rose-700';
  };

  const getCredibilityBg = (score: number) => {
    if (score >= 70) return 'bg-emerald-50 border-emerald-200';
    if (score >= 45) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl font-serif tracking-tight text-slate-900">TruthLens</span>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/"><Button variant="ghost">Home</Button></Link>
          <Link to="/live-feed"><Button variant="ghost">Live Feed</Button></Link>
          {user ? (
            <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">Logout</Button>
          ) : (
            <Link to="/login"><Button variant="default">Sign In</Button></Link>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in space-y-12">

        {/* 1. Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mx-auto">
            <span>{article.source_name}</span>
            <span>•</span>
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-serif leading-tight text-slate-900">
            {article.title}
          </h1>

          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.open(article.id.toString(), '_blank')} className="gap-2">
              <ExternalLink className="h-4 w-4" /> View Source
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)} className="text-muted-foreground hover:text-rose-600">
              <Flag className="h-4 w-4 mr-1" /> Report
            </Button>
          </div>
        </div>

        {/* 2. Credibility Visualization (Hero) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Left: Score Gauge */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#059669', '#3B82F6', '#D97706', '#6366F1'][index % 4]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`text-5xl font-bold font-serif ${getCredibilityColor(article.overall_credibility)}`}>
                    {Math.round(article.overall_credibility)}
                  </span>
                </div>
              </div>
              <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-wide ${getCredibilityBg(article.overall_credibility)} ${getCredibilityColor(article.overall_credibility)}`}>
                {article.credibility_status}
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic text-center max-w-[200px]">
                "CrediLens provides insights, not absolute truth."
              </p>
            </div>

            {/* Right: Explanation & Signals */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-xl font-bold font-serif mb-2 text-slate-900">Why this score?</h3>
                <ScoreExplainer />
              </div>

              {/* Signal Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center text-center">
                  <span className="text-3xl font-bold text-emerald-700">{article.factual_sentences?.length || 0}</span>
                  <span className="text-xs font-semibold text-emerald-900 uppercase mt-1">Factual Signals Detected</span>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex flex-col items-center text-center">
                  <span className="text-3xl font-bold text-rose-700">{article.hype_sentences?.length || 0}</span>
                  <span className="text-xs font-semibold text-rose-900 uppercase mt-1">Hype Signals Detected</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Highlighted Article Content */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12">
          <HypeHighlighter
            content={article.content}
            hypeSentences={article.hype_sentences}
            factualSentences={article.factual_sentences}
          />
        </section>

        {/* 4. Community Verification */}
        <section className="bg-slate-50 rounded-2xl border-t border-slate-200 pt-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-2xl font-bold font-serif text-center flex items-center justify-center gap-3">
              <MessageSquare className="h-6 w-6 text-slate-500" />
              Community Verification
            </h3>

            {/* Rate Card */}
            <Card className="border-border/60 shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Verify This Story</label>
                    <span className="text-sm font-bold text-primary">{rating}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    disabled={!user || article.is_soft_locked || article.user_has_rated}
                  />
                  {article.user_has_rated ? (
                    <Button disabled className="w-full">Rated {article.user_credibility_rating}%</Button>
                  ) : (
                    <Button onClick={handleRateArticle} disabled={!user || submitting} className="w-full">Submit Rating</Button>
                  )}
                  {!user && <Link to="/login" className="text-xs text-center block text-primary hover:underline">Log in to contribute</Link>}
                </div>
              </CardContent>
            </Card>

            <CommentSection articleId={article.id} />
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
          <Footer />
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
    </div>
  );
}
