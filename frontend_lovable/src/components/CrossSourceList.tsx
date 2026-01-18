import { CrossSource } from '@/types';
import { CredibilityBadge } from './CredibilityBadge';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface CrossSourceListProps {
  sources: CrossSource[];
}

export function CrossSourceList({ sources }: CrossSourceListProps) {
  if (sources.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">No independent sources have verified this article yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-credibility-high font-medium">
        <CheckCircle2 className="h-4 w-4" />
        <span>Supported by {sources.length} independent source{sources.length > 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-2">
        {sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg border border-border hover:border-trust/50 hover:bg-secondary/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{source.sourceName}</span>
                  <CredibilityBadge score={source.sourceCredibility} size="sm" showLabel={false} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {source.headline}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-trust flex-shrink-0 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
