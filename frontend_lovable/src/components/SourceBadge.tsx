import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';

interface SourceBadgeProps {
    sourceName: string;
    trustScore: number;
    sourceId?: number;
    size?: 'sm' | 'md';
    clickable?: boolean;
}

export function SourceBadge({ sourceName, trustScore, sourceId, size = 'sm', clickable = true }: SourceBadgeProps) {
    const getTrustLevel = (score: number) => {
        if (score >= 70) return {
            level: 'trusted',
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
            icon: CheckCircle
        };
        if (score >= 45) return {
            level: 'moderate',
            color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
            icon: Shield
        };
        return {
            level: 'caution',
            color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
            icon: AlertTriangle
        };
    };

    const trust = getTrustLevel(trustScore);
    const Icon = trust.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-2.5 py-1.5'
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-3.5 w-3.5'
    };

    const badgeContent = (
        <Badge
            variant="outline"
            className={`${trust.color} ${sizeClasses[size]} font-medium border flex items-center gap-1.5 transition-colors ${clickable ? 'cursor-pointer' : ''}`}
        >
            <Icon className={iconSizes[size]} />
            <span className="max-w-[120px] truncate">{sourceName}</span>
            <span className="opacity-70 font-mono">{Math.round(trustScore)}%</span>
        </Badge>
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {clickable && sourceId ? (
                        <Link to={`/source/${sourceId}`}>
                            {badgeContent}
                        </Link>
                    ) : (
                        <div>{badgeContent}</div>
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-xs space-y-1">
                        <p className="font-semibold">{sourceName}</p>
                        <p className="text-muted-foreground">
                            Trust Score: {Math.round(trustScore)}%
                            {trustScore >= 70 && " - Highly Reliable"}
                            {trustScore >= 45 && trustScore < 70 && " - Moderately Reliable"}
                            {trustScore < 45 && " - Use Caution"}
                        </p>
                        {clickable && <p className="text-xs text-primary mt-1">Click to view source profile</p>}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
