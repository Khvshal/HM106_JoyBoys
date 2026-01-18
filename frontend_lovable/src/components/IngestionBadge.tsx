import { Badge } from '@/components/ui/badge';
import { Rss, UserPlus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface IngestionBadgeProps {
    type: 'rss' | 'user' | 'aggregated' | 'user-submitted';
    size?: 'sm' | 'md';
}

export function IngestionBadge({ type, size = 'sm' }: IngestionBadgeProps) {
    const isAggregated = type === 'rss' || type === 'aggregated';

    const Icon = isAggregated ? Rss : UserPlus;
    const label = isAggregated ? 'Aggregated' : 'User Submitted';
    const color = isAggregated
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-violet-50 text-violet-700 border-violet-200';

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1'
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-3.5 w-3.5'
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant="outline"
                        className={`${color} ${sizeClasses[size]} font-medium border flex items-center gap-1.5`}
                    >
                        <Icon className={iconSizes[size]} />
                        <span>{label}</span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs max-w-xs">
                        {isAggregated
                            ? "Automatically collected from trusted news sources via RSS feeds"
                            : "Submitted by a community member for verification"}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
