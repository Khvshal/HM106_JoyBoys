import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { getCredibilityLevel } from './CredibilityBadge';

interface CredibilityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  breakdown?: {
    sourceTrust: number;
    nlpAnalysis: number;
    communityScore: number;
    crossSourceSupport: number;
  };
}

export function CredibilityScore({ score, size = 'md', showLabel = false, breakdown }: CredibilityScoreProps) {
  const level = getCredibilityLevel(score);

  const sizePixel = {
    sm: 40,
    md: 56,
    lg: 80,
    xl: 112,
  }[size];

  const fontSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl',
  }[size];

  const textColorClass = {
    high: 'text-emerald-700',
    medium: 'text-amber-700',
    low: 'text-rose-700',
    neutral: 'text-slate-500',
  }[level];

  // Default data if breakdown missing (single color ring)
  const defaultData = [{ value: 100, color: level === 'high' ? '#059669' : level === 'medium' ? '#d97706' : '#be123c' }];

  const data = breakdown ? [
    { value: breakdown.sourceTrust, color: '#059669' }, // Emerald
    { value: breakdown.nlpAnalysis, color: '#3B82F6' }, // Blue
    { value: breakdown.communityScore, color: '#D97706' }, // Amber
    { value: breakdown.crossSourceSupport, color: '#6366F1' }, // Indigo
  ] : defaultData;

  // Use PieChart for ring
  // Inner radius proportional to size
  const outer = sizePixel / 2;
  const inner = outer - (size === 'sm' ? 3 : size === 'md' ? 4 : 6);

  // If simple score (no breakdown), we want the partial ring effect defined by score?
  // Original SVG implementation used stroke-dashoffset to show percentage of ring.
  // Recharts Pie shows segments.
  // If we want "progress ring" style (percentage of circle filled), Recharts isn't best for single value progress unless we have [score, 100-score].
  // But user said "pi chart", implying the multi-colored segments found in Detail page.
  // Detail page Pie shows breakdown.
  // So if we have breakdown, use it.
  // If not, revert to SVG for progress ring?
  // Or display full ring of segments (if scores are 0-100, they fill the circle?). 
  // Wait, in Detail page, the Pie has segments with `value`. If `sourceTrust` is 80, `value` is 80.
  // The segments sum up to... whatever. Recharts scales them to 360 degrees.
  // So it shows PROPORTION of contribution.
  // This is what the Detail page does.

  // If no breakdown, use SVG (existing logic).
  if (!breakdown) {
    // ... (Keep existing SVG logic but update styling to match)
    // Actually, let's keep the existing implementation for fallback but updated colors.
    const radiusVal = (sizePixel / 2) - (size === 'sm' ? 2 : 4);
    const strokeW = size === 'sm' ? 3 : 4;
    const circumference = 2 * Math.PI * radiusVal;
    const offset = circumference - (score / 100) * circumference;

    const strokeColor = level === 'high' ? 'text-emerald-500' : level === 'medium' ? 'text-amber-500' : 'text-rose-500';

    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`relative flex items-center justify-center`} style={{ width: sizePixel, height: sizePixel }}>
          <svg className="w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r={radiusVal} fill="none" stroke="currentColor" strokeWidth={strokeW} className="text-slate-200" />
            <circle cx="50%" cy="50%" r={radiusVal} fill="none" stroke="currentColor" strokeWidth={strokeW}
              strokeLinecap="round" className={`${strokeColor} transition-all duration-500`}
              strokeDasharray={circumference} strokeDashoffset={offset} />
          </svg>
          <span className={cn('absolute font-bold font-serif', textColorClass, fontSize)}>
            {Math.round(score)}
          </span>
        </div>
        {showLabel && <span className={cn('text-[10px] font-bold uppercase tracking-wider', textColorClass)}>{level === 'high' ? 'Reliable' : level === 'medium' ? 'Mixed' : 'High Risk'}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: sizePixel, height: sizePixel }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={inner} outerRadius={outer}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={cn('font-bold font-serif', textColorClass, fontSize)}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-[10px] font-bold uppercase tracking-wider', textColorClass)}>
          {level === 'high' ? 'Reliable' : level === 'medium' ? 'Mixed' : 'High Risk'}
        </span>
      )}
    </div>
  );
}
