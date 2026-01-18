import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { articlesAPI, adminAPI } from '@/services/api';

interface Article {
  id: number;
  title: string;
  source_name: string;
  overall_credibility: number;
  credibility_status: string;
  is_soft_locked: boolean;
  soft_lock_reason?: string;
  suspicious_activity_detected: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [lockReason, setLockReason] = useState('');
  const [overrideScore, setOverrideScore] = useState('');
  const [justification, setJustification] = useState('');
  const [showLockModal, setShowLockModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll(0, 100, 'newest');
      setArticles(response.data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const suspiciousArticles = articles.filter(a => a.suspicious_activity_detected || a.is_soft_locked);
  const lowCredArticles = articles.filter(a => a.overall_credibility < 40);
  const underReviewArticles = articles.filter(a => a.credibility_status === 'Under Review');

  const handleLockArticle = async (article: Article) => {
    if (!lockReason.trim()) {
      toast.error('Please provide a lock reason');
      return;
    }

    try {
      await adminAPI.softLock(article.id, lockReason);

      setArticles(prev => prev.map(a =>
        a.id === article.id
          ? { ...a, is_soft_locked: true, soft_lock_reason: lockReason }
          : a
      ));

      toast.success(`Article locked: ${lockReason}`);
      setShowLockModal(false);
      setLockReason('');
      setSelectedArticle(null);
    } catch (error) {
      toast.error('Failed to lock article');
    }
  };

  const handleUnlockArticle = async (articleId: number) => {
    try {
      await adminAPI.removeSoftLock(articleId);

      setArticles(prev => prev.map(a =>
        a.id === articleId
          ? { ...a, is_soft_locked: false, soft_lock_reason: undefined }
          : a
      ));
      toast.success('Article unlocked');
    } catch (error) {
      toast.error('Failed to unlock article');
    }
  };

  const handleOverrideScore = async () => {
    if (!selectedArticle || !overrideScore || !justification.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const newScore = parseFloat(overrideScore);
      if (newScore < 0 || newScore > 100) {
        toast.error('Score must be between 0 and 100');
        return;
      }

      await adminAPI.overrideScore(selectedArticle.id, newScore, justification);

      setArticles(prev => prev.map(a =>
        a.id === selectedArticle.id
          ? { ...a, overall_credibility: newScore }
          : a
      ));

      toast.success(`Score updated to ${newScore}%`);
      setShowOverrideModal(false);
      setOverrideScore('');
      setJustification('');
      setSelectedArticle(null);
    } catch (error) {
      toast.error('Failed to update score');
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 45) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Widely Corroborated') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'High Risk') return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const getStatusEmoji = (status: string) => {
    if (status === 'Widely Corroborated') return '🟢';
    if (status === 'High Risk') return '🔴';
    return '🟡';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Link>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold font-serif">TruthLens Admin</h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-serif tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground">Monitor content credibility and user reports.</p>
          </div>
          <Button variant="outline" onClick={fetchArticles} className="gap-2">
            <BarChart3 className="h-4 w-4" /> Refresh Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suspicious Activity</p>
                  <p className="text-3xl font-bold mt-1 text-rose-600">{suspiciousArticles.length}</p>
                </div>
                <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Locked Content</p>
                  <p className="text-3xl font-bold mt-1 text-amber-600">{articles.filter(a => a.is_soft_locked).length}</p>
                </div>
                <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Lock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                  <p className="text-3xl font-bold mt-1 text-blue-600">{underReviewArticles.length}</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Credibility</p>
                  <p className="text-3xl font-bold mt-1 text-gray-700">{lowCredArticles.length}</p>
                </div>
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="suspicious" className="space-y-6">
          <TabsList className="w-full justify-start p-1 bg-secondary/50 rounded-xl h-auto gap-2">
            <TabsTrigger value="suspicious" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">🚨 Suspicious <Badge variant="secondary" className="ml-2">{suspiciousArticles.length}</Badge></TabsTrigger>
            <TabsTrigger value="review" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">👀 Needs Review <Badge variant="secondary" className="ml-2">{underReviewArticles.length}</Badge></TabsTrigger>
            <TabsTrigger value="lowcred" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">📉 Low Credibility <Badge variant="secondary" className="ml-2">{lowCredArticles.length}</Badge></TabsTrigger>
            <TabsTrigger value="spam" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">⚠️ Spam Alerts <Badge variant="destructive" className="ml-2">0</Badge></TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">📄 All Content <Badge variant="secondary" className="ml-2">{articles.length}</Badge></TabsTrigger>
          </TabsList>

          {/* Suspicious Articles */}
          <TabsContent value="suspicious" className="space-y-4 animate-slide-up">
            {suspiciousArticles.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-dashed">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-500/50" />
                <h3 className="text-lg font-medium">All Clear</h3>
                <p className="text-muted-foreground">No suspicious articles detected requiring immediate attention.</p>
              </div>
            ) : (
              suspiciousArticles.map(article => (
                <Card key={article.id} className="overflow-hidden border-l-4 border-l-rose-500">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50">Flagged</Badge>
                          <span className="text-xs text-muted-foreground">ID: {article.id}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold line-clamp-2 mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          From <span className="font-medium text-foreground">{article.source_name}</span> • {new Date(article.created_at).toLocaleDateString()}
                        </p>
                        {article.is_soft_locked && (
                          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-900">
                            <Lock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                            <span>Locked: {article.soft_lock_reason}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex md:flex-col items-center justify-between md:items-end gap-4 min-w-[200px]">
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getCredibilityColor(article.overall_credibility)}`}>
                            {Math.round(article.overall_credibility)}%
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trust Score</span>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          {article.is_soft_locked ? (
                            <Button size="sm" variant="outline" className="flex-1 md:flex-none border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => handleUnlockArticle(article.id)}>
                              <Unlock className="h-3.5 w-3.5 mr-1.5" /> Unlock
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="flex-1 md:flex-none hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" onClick={() => { setSelectedArticle(article); setShowLockModal(true); }}>
                              <Lock className="h-3.5 w-3.5 mr-1.5" /> Lock
                            </Button>
                          )}
                          <Button size="sm" variant="secondary" className="flex-1 md:flex-none" onClick={() => { setSelectedArticle(article); setShowOverrideModal(true); }}>
                            Override
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Under Review */}
          <TabsContent value="review" className="space-y-4 animate-slide-up">
            {underReviewArticles.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-dashed">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-500/50" />
                <h3 className="text-lg font-medium">Caught Up</h3>
                <p className="text-muted-foreground">No articles currently marked for manual review.</p>
              </div>
            ) : (
              underReviewArticles.map(article => (
                <Card key={article.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-bold mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.source_name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">Needs Review</Badge>
                        <div className={`text-2xl font-bold ${getCredibilityColor(article.overall_credibility)}`}>
                          {Math.round(article.overall_credibility)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Low Credibility */}
          <TabsContent value="lowcred" className="space-y-4 animate-slide-up">
            {lowCredArticles.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-dashed">
                <Shield className="h-12 w-12 mx-auto mb-4 text-emerald-500/50" />
                <h3 className="text-lg font-medium">High Quality Feed</h3>
                <p className="text-muted-foreground">No articles with dangerously low credibility scores currently active.</p>
              </div>
            ) : (
              lowCredArticles.map(article => (
                <Card key={article.id} className="border-l-4 border-l-gray-400">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-bold text-muted-foreground mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.source_name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-500">{Math.round(article.overall_credibility)}%</div>
                        <Badge variant="outline" className="mt-1">Low Confidence</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Spam Alerts Tab */}
          <TabsContent value="spam" className="space-y-4 animate-slide-up">
            <div className="text-center py-16 bg-card rounded-xl border border-dashed">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-500/50" />
              <h3 className="text-lg font-medium">Automated Spam Detection Active</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Our system monitors for coordinated attacks, vote manipulation, new account brigading, and suspicious patterns. Flagged activity appears here for review.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground mt-1">IP Clusters</div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground mt-1">Vote Spikes</div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground mt-1">New Accounts</div>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-xs text-muted-foreground mt-1">Flagged Users</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* All Articles */}
          <TabsContent value="all" className="space-y-4 animate-slide-up">
            {articles.map(article => (
              <Card key={article.id} className="group hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{article.source_name} • {new Date(article.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-2xl font-bold ${getCredibilityColor(article.overall_credibility)}`}>
                      {Math.round(article.overall_credibility)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Lock Modal */}
      {showLockModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-600" />
                Suspending Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <p className="text-sm font-medium mb-1">Article:</p>
                <p className="text-sm text-muted-foreground line-clamp-2 italic">"{selectedArticle.title}"</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Suspension</label>
                <Input
                  placeholder="e.g., Brigading detected, Content outdated..."
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  className="bg-secondary/20"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => handleLockArticle(selectedArticle)} className="flex-1 bg-amber-600 hover:bg-amber-700">
                  Confirm Lock
                </Button>
                <Button variant="outline" onClick={() => { setShowLockModal(false); setLockReason(''); }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="border-b bg-secondary/20">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Manual Score Override
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="bg-secondary/20 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm font-medium">Current Algo Score</span>
                <span className="font-mono font-bold text-lg">{Math.round(selectedArticle.overall_credibility)}%</span>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">New Score (0-100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(e.target.value)}
                  className="font-mono text-lg"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Admin Justification</label>
                <Input
                  placeholder="Reviewer note is required..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleOverrideScore} className="flex-1">Update Score</Button>
                <Button variant="outline" onClick={() => { setShowOverrideModal(false); setOverrideScore(''); setJustification(''); }}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
