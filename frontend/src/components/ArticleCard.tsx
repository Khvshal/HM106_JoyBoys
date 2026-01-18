import { useNavigate } from 'react-router-dom';
import { Article } from '@/types';
import { CredibilityBadge } from './CredibilityBadge';
import { CredibilityScore } from './CredibilityScore';
import { Clock, ExternalLink, AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { articlesAPI } from '@/services/api';

interface ArticleCardProps {
  article: Article & { thumbnail?: string; isLive?: boolean };
  variant?: 'default' | 'compact' | 'featured';
  onAnalyze?: (article: any) => void;
}

export function ArticleCard({ article, variant = 'default', onAnalyze }: ArticleCardProps) {
  const navigate = useNavigate();
  const timeAgo = article.isLive
    ? (typeof article.publishedAt === 'string' ? article.publishedAt : 'Just now')
    : formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  const handleCardClick = (e: React.MouseEvent) => {
    if (article.isLive) {
      if (onAnalyze) onAnalyze(article);
      return;
    }
    // Prevent navigation if text is selected
    if (window.getSelection()?.toString()) return;
    navigate(`/article/${article.id}`);
  };

  const handleQuickRate = async (e: React.MouseEvent, type: 'trust' | 'distrust') => {
    e.stopPropagation();
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    try {
      const rating = type === 'trust' ? 100 : 0;
      await articlesAPI.rate(parseInt(article.id), rating);
      toast.success(type === 'trust' ? 'Marked as Trustworthy' : 'Marked as Untrustworthy');
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  const QuickActions = () => (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50" onClick={e => e.stopPropagation()}>
      {article.isLive ? (
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-9"
          onClick={() => onAnalyze && onAnalyze(article)}
        >
          Analyze Credibility
        </Button>
      ) : (
        <>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-green-600 hover:bg-green-50" onClick={(e) => handleQuickRate(e, 'trust')}>
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            Trust
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50" onClick={(e) => handleQuickRate(e, 'distrust')}>
            <ThumbsDown className="h-3.5 w-3.5 mr-1" />
            Doubt
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-primary ml-auto" onClick={(e) => { e.stopPropagation(); navigate(`/article/${article.id}#comments`); }}>
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            Discuss
          </Button>
        </>
      )}
    </div>
  );

  // Default variant (refined for glassmorphism and consistency)
  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "glass-card block group cursor-pointer flex flex-col h-full hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden",
        article.isLive && "border-primary/20 bg-primary/5"
      )}
    >
      {article.isLocked && (
        <div className="bg-destructive/10 text-destructive text-xs px-3 py-1.5 flex items-center gap-2 border-b border-destructive/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="truncate font-medium">{article.lockReason || 'Verification in progress'}</span>
        </div>
      )}

      {/* Image section for RSS/Live items or if thumbnail exists */}
      {(article.thumbnail || article.isLive) && (
        <div className="aspect-video relative overflow-hidden bg-muted">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.headline}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <Shield className="h-12 w-12 text-primary/20" />
            </div>
          )}
          {article.isLive && (
            <Badge className="absolute top-3 left-3 bg-primary text-white border-none shadow-md">
              Live Feed
            </Badge>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {article.category || 'General'}
              </span>
              {!article.isLive && <CredibilityBadge status={article.status} size="sm" />}
              {article.isLive && <Badge variant="outline" className="text-[10px] h-5 border-emerald-200 bg-emerald-50 text-emerald-700">Analysis Ready</Badge>}
            </div>
            <h3 className="headline text-lg font-bold font-serif leading-snug group-hover:text-primary transition-colors line-clamp-3">
              {article.headline}
            </h3>
          </div>
          {/* Score Badge */}
          {!article.isLive && (
            <div className="flex-shrink-0 pt-1">
              <CredibilityScore score={article.credibilityScore} size="md" />
            </div>
          )}
        </div>

        {article.summary && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {article.summary}
          </p>
        )}

        <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-border/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{article.source.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
            </div>
            {article.isLive && (
              <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <QuickActions />
        </div>
      </div>
    </div>
  );
}
