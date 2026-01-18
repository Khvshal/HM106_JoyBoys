import { CredibilityBreakdown } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface CredibilityBreakdownChartProps {
  breakdown: CredibilityBreakdown;
  size?: 'sm' | 'md' | 'lg';
}

const BREAKDOWN_CONFIG = [
  { key: 'sourceTrust', label: 'Source Trust', color: '#0D9488', description: 'Historical reliability of the news source' },
  { key: 'communityScore', label: 'Community Score', color: '#6366F1', description: 'Aggregate ratings from verified users' },
  { key: 'nlpAnalysis', label: 'NLP Analysis', color: '#8B5CF6', description: 'AI detection of emotional/sensational language' },
  { key: 'crossSourceSupport', label: 'Cross-Source', color: '#EC4899', description: 'Verification by independent sources' },
];

export function CredibilityBreakdownChart({ breakdown, size = 'md' }: CredibilityBreakdownChartProps) {
  const data = BREAKDOWN_CONFIG.map((config) => ({
    name: config.label,
    value: breakdown[config.key as keyof CredibilityBreakdown],
    color: config.color,
    description: config.description,
  }));

  const sizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 shadow-lg">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-2xl font-bold" style={{ color: data.color }}>{data.value}%</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className={cn('w-full', sizeClasses[size])}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size === 'sm' ? 30 : size === 'md' ? 45 : 60}
              outerRadius={size === 'sm' ? 50 : size === 'md' ? 75 : 95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{item.name}</div>
              <div className="text-sm font-semibold" style={{ color: item.color }}>
                {item.value}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
