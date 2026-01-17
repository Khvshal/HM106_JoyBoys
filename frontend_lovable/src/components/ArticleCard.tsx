import { useNavigate } from 'react-router-dom';
import { Article } from '@/types';
import { CredibilityBadge } from './CredibilityBadge';
import { CredibilityScore } from './CredibilityScore';
import { Clock, ExternalLink, AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { articlesAPI } from '@/services/api';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const navigate = useNavigate();
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  const handleCardClick = (e: React.MouseEvent) => {
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
      await articlesAPI.rate(parseInt(article.id), rating); // API now accepts rating_value
      toast.success(type === 'trust' ? 'Marked as Trustworthy' : 'Marked as Untrustworthy');
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  const QuickActions = () => (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50" onClick={e => e.stopPropagation()}>
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
    </div>
  );

  if (variant === 'compact') {
    return ( // Keep compact as Link for simplicity or refactor too? limiting scope to cards that support actions
      <div onClick={handleCardClick} className="news-card block group cursor-pointer hover:border-primary/20">
        <div className="flex items-start gap-4">
          <CredibilityScore score={article.credibilityScore} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base font-semibold line-clamp-2 group-hover:text-trust transition-colors">
              {article.headline}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="font-medium">{article.source.name}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
          <CredibilityBadge status={article.status} size="sm" showLabel={false} />
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div onClick={handleCardClick} className="news-card block group relative overflow-hidden cursor-pointer">
        {article.isLocked && (
          <div className="absolute top-0 left-0 right-0 bg-credibility-medium-bg text-credibility-medium text-xs px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            {article.lockReason}
          </div>
        )}
        <div className={cn('flex flex-col md:flex-row gap-5', article.isLocked && 'pt-8')}>
          <div className="flex-shrink-0 flex items-center justify-center md:w-24">
            <CredibilityScore score={article.credibilityScore} size="lg" showLabel />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-trust">
                {article.category}
              </span>
              <CredibilityBadge status={article.status} size="sm" />
            </div>
            <h2 className="headline text-2xl md:text-3xl mb-3 group-hover:text-trust transition-colors">
              {article.headline}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {article.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <span
                  className="font-medium hover:text-trust transition-colors z-10 relative"
                  onClick={(e) => { e.stopPropagation(); navigate(`/source/${article.source.id}`); }}
                >
                  {article.source.name}
                </span>
                <CredibilityBadge score={article.source.credibilityScore} size="sm" showLabel={false} />
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {timeAgo}
                </span>
              </div>
            </div>

            {/* Quick Actions for Featured */}
            <QuickActions />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div onClick={handleCardClick} className="glass-card block group cursor-pointer flex flex-col h-full hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {article.isLocked && (
        <div className="bg-destructive/10 text-destructive text-xs px-3 py-1.5 flex items-center gap-2 border-b border-destructive/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="truncate font-medium">{article.lockReason || 'Verification in progress'}</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {article.category || 'General'}
              </span>
              <CredibilityBadge status={article.status} size="sm" />
            </div>
            <h3 className="headline text-lg sm:text-xl font-bold font-serif leading-snug group-hover:text-primary transition-colors line-clamp-3">
              {article.headline}
            </h3>
          </div>
          {/* Score Badge - Fixed width to prevent overlap */}
          <div className="flex-shrink-0 pt-1">
            <CredibilityScore score={article.credibilityScore} size="md" />
          </div>
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
          </div>

          <QuickActions />
        </div>
      </div>
    </div>
  );
}
