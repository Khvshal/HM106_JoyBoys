import { Link } from 'react-router-dom';
import { Source } from '@/types';
import { CredibilityScore } from './CredibilityScore';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ExternalLink, FileText, AlertTriangle } from 'lucide-react';

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  const trendData = source.historicalTrend.map((value, index) => ({ value }));
  const trendDirection = source.historicalTrend[source.historicalTrend.length - 1] >= source.historicalTrend[0];

  return (
    <Link 
      to={`/source/${source.id}`} 
      className="news-card block group"
    >
      <div className="flex items-start gap-4">
        <CredibilityScore score={source.credibilityScore} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-serif text-lg font-semibold group-hover:text-trust transition-colors">
              {source.name}
            </h3>
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">{source.domain}</p>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{source.articlesPublished.toLocaleString()} articles</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>{(source.reportFrequency * 100).toFixed(1)}% report rate</span>
            </div>
          </div>
        </div>
        
        {/* Mini trend chart */}
        <div className="w-20 h-12 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={trendDirection ? 'hsl(var(--credibility-high))' : 'hsl(var(--credibility-low))'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
}
