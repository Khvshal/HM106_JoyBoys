import { HighlightedText } from '@/types';
import { cn } from '@/lib/utils';

interface HighlightedArticleBodyProps {
  content: HighlightedText[];
}

export function HighlightedArticleBody({ content }: HighlightedArticleBodyProps) {
  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs border-b border-border pb-3">
        <span className="text-muted-foreground">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="highlight-factual">factual</span>
          <span className="text-muted-foreground">- Verified fact</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="highlight-emotional">emotional</span>
          <span className="text-muted-foreground">- Emotional/sensational</span>
        </div>
      </div>

      {/* Article content */}
      <p className="text-base leading-relaxed">
        {content.map((segment, index) => (
          <span
            key={index}
            className={cn(
              segment.type === 'emotional' && 'highlight-emotional',
              segment.type === 'factual' && 'highlight-factual'
            )}
          >
            {segment.text}
          </span>
        ))}
      </p>
    </div>
  );
}
