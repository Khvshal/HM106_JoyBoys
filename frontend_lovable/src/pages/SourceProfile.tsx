

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CredibilityScore } from '@/components/CredibilityScore';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { sourcesAPI, articlesAPI } from '@/services/api';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft, ExternalLink, FileText, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';

export default function SourceProfile() {
  const { id } = useParams();
  const [source, setSource] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sourceRes = await sourcesAPI.getById(parseInt(id!));
        setSource(sourceRes.data);

        // Fetch articles and filter by source (ideal would be backend filtering)
        // Since we don't have a backend filter endpoint ready, we'll fetch recent articles and client-side filter
        // or just show recent articles from this source if we had that endpoint.
        // For now, let's fetch all and filter client-side as a temporary measure or add it to backend.
        // Checking backend capability: articlesAPI.getAll returns all. 
        // We will implement client-side filtering for this demo step.
        const articlesRes = await articlesAPI.getAll(0, 50);
        const sourceArts = articlesRes.data.filter((a: any) => a.source_name === sourceRes.data.name);
        setArticles(sourceArts);

      } catch (error) {
        console.error('Failed to load source', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="headline text-3xl mb-4">Source Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The source you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  // Mock trend data for now as backend doesn't provide history yet
  const trendData = [
    { month: 'Jun', score: Math.max(0, source.credibility_score - 5) },
    { month: 'Jul', score: Math.max(0, source.credibility_score - 2) },
    { month: 'Aug', score: source.credibility_score },
    { month: 'Sep', score: Math.min(100, source.credibility_score + 1) },
    { month: 'Oct', score: Math.min(100, source.credibility_score + 3) },
    { month: 'Nov', score: source.credibility_score },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>

        {/* Source Header */}
        <div className="news-card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <CredibilityScore score={source.credibility_score} size="xl" showLabel />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="headline text-3xl">{source.name}</h1>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-trust transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
              <p className="text-muted-foreground mb-4">{source.domain}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{source.articles_published || 0}</span>
                  <span className="text-muted-foreground">articles published</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{((source.corroboration_rate || 0) * 100).toFixed(1)}%</span>
                  <span className="text-muted-foreground">corroboration rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Historical Trend */}
          <div className="lg:col-span-2">
            <div className="news-card">
              <h2 className="section-header flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Credibility Trend (6 months)
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--trust))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--trust))', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="news-card text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Score</p>
              <p className="text-4xl font-bold text-trust">{Math.round(source.credibility_score)}%</p>
            </div>
            {/*
            <div className="news-card text-center">
              <p className="text-sm text-muted-foreground mb-1">6-Month Change</p>
              <p className="text-2xl font-bold text-credibility-high">
                +2%
              </p>
            </div>
            */}
          </div>
        </div>

        {/* Articles from this source */}
        {articles.length > 0 && (
          <section className="mt-8">
            <h2 className="section-header">Recent Articles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
