import { CredibilityLevel, ArticleStatus } from '@/types';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CredibilityBadgeProps {
  score?: number;
  status?: ArticleStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function getCredibilityLevel(score: number): CredibilityLevel {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  if (score > 0) return 'low';
  return 'neutral';
}

export function getStatusConfig(status: ArticleStatus) {
  switch (status) {
    case 'verified':
      return { label: 'Verified', icon: CheckCircle, className: 'credibility-high' };
    case 'under_review':
      return { label: 'Under Review', icon: Clock, className: 'credibility-medium' };
    case 'disputed':
      return { label: 'Disputed', icon: XCircle, className: 'credibility-low' };
    case 'user_submitted':
      return { label: 'User Submitted', icon: AlertCircle, className: 'credibility-neutral' };
    default:
      return { label: 'Unknown', icon: AlertCircle, className: 'credibility-neutral' };
  }
}

export function CredibilityBadge({ score, status, size = 'md', showLabel = true }: CredibilityBadgeProps) {
  if (status) {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    
    return (
      <span className={cn(
        'credibility-badge',
        config.className,
        size === 'sm' && 'text-[10px] px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1.5'
      )}>
        <Icon className={cn(
          size === 'sm' && 'w-3 h-3',
          size === 'md' && 'w-3.5 h-3.5',
          size === 'lg' && 'w-4 h-4'
        )} />
        {showLabel && config.label}
      </span>
    );
  }

  if (score !== undefined) {
    const level = getCredibilityLevel(score);
    const levelClass = `credibility-${level}`;
    
    return (
      <span className={cn(
        'credibility-badge',
        levelClass,
        size === 'sm' && 'text-[10px] px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1.5'
      )}>
        {score}%
        {showLabel && (
          <span className="ml-1 opacity-80">
            {level === 'high' && 'Credible'}
            {level === 'medium' && 'Mixed'}
            {level === 'low' && 'Low'}
            {level === 'neutral' && 'Unrated'}
          </span>
        )}
      </span>
    );
  }

  return null;
}
