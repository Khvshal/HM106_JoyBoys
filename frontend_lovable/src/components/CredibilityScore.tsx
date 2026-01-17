import { cn } from '@/lib/utils';
import { getCredibilityLevel } from './CredibilityBadge';

interface CredibilityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export function CredibilityScore({ score, size = 'md', showLabel = false }: CredibilityScoreProps) {
  const level = getCredibilityLevel(score);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-28 h-28 text-2xl',
  };

  const strokeWidth = {
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
  };

  const radius = {
    sm: 16,
    md: 22,
    lg: 32,
    xl: 44,
  };

  const circumference = 2 * Math.PI * radius[size];
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorClass = {
    high: 'stroke-credibility-high',
    medium: 'stroke-credibility-medium',
    low: 'stroke-credibility-low',
    neutral: 'stroke-credibility-neutral',
  }[level];

  const textColorClass = {
    high: 'text-credibility-high',
    medium: 'text-credibility-medium',
    low: 'text-credibility-low',
    neutral: 'text-credibility-neutral',
  }[level];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('score-ring', sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${(radius[size] + strokeWidth[size]) * 2} ${(radius[size] + strokeWidth[size]) * 2}`}>
          <circle
            cx={radius[size] + strokeWidth[size]}
            cy={radius[size] + strokeWidth[size]}
            r={radius[size]}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth[size]}
            className="text-muted/30"
          />
          <circle
            cx={radius[size] + strokeWidth[size]}
            cy={radius[size] + strokeWidth[size]}
            r={radius[size]}
            fill="none"
            strokeWidth={strokeWidth[size]}
            strokeLinecap="round"
            className={cn(colorClass, 'transition-all duration-500')}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className={cn('absolute font-semibold', textColorClass)}>
          {Math.round(score)}
        </span>
      </div>
      {showLabel && (
        <span className={cn('text-xs font-medium', textColorClass)}>
          {level === 'high' && 'High Credibility'}
          {level === 'medium' && 'Mixed Credibility'}
          {level === 'low' && 'Low Credibility'}
          {level === 'neutral' && 'Unrated'}
        </span>
      )}
    </div>
  );
}
