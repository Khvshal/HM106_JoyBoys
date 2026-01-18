import { useState, useEffect } from 'react';
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
  const [localArticle, setLocalArticle] = useState<Article & { user_has_rated?: boolean; user_credibility_rating?: number }>(article);
  const timeAgo = formatDistanceToNow(new Date(localArticle.publishedAt), { addSuffix: true });

  useEffect(() => {
    setLocalArticle(article);
  }, [article]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if text is selected
    if (window.getSelection()?.toString()) return;
    navigate(`/article/${localArticle.id}`);
  };

  const handleQuickRate = async (e: React.MouseEvent, type: 'trust' | 'distrust') => {
    e.stopPropagation();
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    const ratingValue = type === 'trust' ? 100 : 0;
    const isRemove = localArticle.user_has_rated && localArticle.user_credibility_rating === ratingValue;

    try {
      // Optimistic update
      setLocalArticle(prev => ({
        ...prev,
        user_has_rated: !isRemove,
        user_credibility_rating: isRemove ? undefined : ratingValue
      }));

      await articlesAPI.rate(parseInt(localArticle.id), ratingValue); // API now accepts rating_value

      if (isRemove) {
        toast.success('Rating removed');
      } else {
        toast.success(type === 'trust' ? 'Marked as Trustworthy' : 'Marked as Untrustworthy');
      }

    } catch (err) {
      // Revert on failure
      setLocalArticle(article);
      toast.error('Failed to submit rating');
    }
  };

  const QuickActions = () => {
    const isTrust = localArticle.user_has_rated && localArticle.user_credibility_rating === 100;
    const isDistrust = localArticle.user_has_rated && localArticle.user_credibility_rating === 0;

    return (
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50" onClick={e => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 text-xs text-muted-foreground hover:text-green-600 hover:bg-green-50",
            isTrust && "text-green-600 bg-green-50 font-medium"
          )}
          onClick={(e) => handleQuickRate(e, 'trust')}
        >
          <ThumbsUp className={cn("h-3.5 w-3.5 mr-1", isTrust && "fill-current")} />
          Trust
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50",
            isDistrust && "text-red-600 bg-red-50 font-medium"
          )}
          onClick={(e) => handleQuickRate(e, 'distrust')}
        >
          <ThumbsDown className={cn("h-3.5 w-3.5 mr-1", isDistrust && "fill-current")} />
          Doubt
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-primary ml-auto" onClick={(e) => { e.stopPropagation(); navigate(`/article/${localArticle.id}#comments`); }}>
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          Discuss
        </Button>
      </div>
    );
  };

  if (variant === 'compact') {
    return ( // Keep compact as Link for simplicity or refactor too? limiting scope to cards that support actions
      <div onClick={handleCardClick} className="news-card block group cursor-pointer hover:border-primary/20">
        <div className="flex items-start gap-4">
          <CredibilityScore score={localArticle.credibilityScore} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base font-semibold line-clamp-2 group-hover:text-trust transition-colors">
              {localArticle.headline}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="font-medium">{localArticle.source.name}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
          <CredibilityBadge status={localArticle.status} size="sm" showLabel={false} />
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div onClick={handleCardClick} className="news-card block group relative overflow-hidden cursor-pointer">
        {localArticle.isLocked && (
          <div className="absolute top-0 left-0 right-0 bg-credibility-medium-bg text-credibility-medium text-xs px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            {localArticle.lockReason}
          </div>
        )}
        <div className={cn('flex flex-col md:flex-row gap-5', localArticle.isLocked && 'pt-8')}>
          <div className="flex-shrink-0 flex items-center justify-center md:w-24">
            <CredibilityScore score={localArticle.credibilityScore} size="lg" showLabel />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-trust">
                {localArticle.category}
              </span>
              <CredibilityBadge status={localArticle.status} size="sm" />
            </div>
            <h2 className="headline text-2xl md:text-3xl mb-3 group-hover:text-trust transition-colors">
              {localArticle.headline}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {localArticle.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <span
                  className="font-medium hover:text-trust transition-colors z-10 relative"
                  onClick={(e) => { e.stopPropagation(); navigate(`/source/${localArticle.source.id}`); }}
                >
                  {localArticle.source.name}
                </span>
                <CredibilityBadge score={localArticle.source.credibilityScore} size="sm" showLabel={false} />
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
      {localArticle.isLocked && (
        <div className="bg-destructive/10 text-destructive text-xs px-3 py-1.5 flex items-center gap-2 border-b border-destructive/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="truncate font-medium">{localArticle.lockReason || 'Verification in progress'}</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {localArticle.category || 'General'}
              </span>
              <CredibilityBadge status={localArticle.status} size="sm" />
            </div>
            <h3 className="headline text-lg sm:text-xl font-bold font-serif leading-snug group-hover:text-primary transition-colors line-clamp-3">
              {localArticle.headline}
            </h3>
          </div>
          {/* Score Badge - Fixed width to prevent overlap */}
          <div className="flex-shrink-0 pt-1">
            <CredibilityScore
              score={localArticle.credibilityScore}
              size="md"
              breakdown={localArticle.breakdown || {
                sourceTrust: (localArticle as any).source_trust_score || 50,
                nlpAnalysis: (localArticle as any).nlp_score || 50,
                communityScore: (localArticle as any).community_score || 50,
                crossSourceSupport: (localArticle as any).cross_source_score || 50
              }}
            />
          </div>
        </div>

        {localArticle.summary && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {localArticle.summary}
          </p>
        )}

        <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-border/40">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{localArticle.source.name}</span>
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
    </div >
  );
}
