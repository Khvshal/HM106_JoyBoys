import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoteImpactIndicatorProps {
    userCredibility: number;
    votedUp?: boolean;
    votedDown?: boolean;
}

export function VoteImpactIndicator({ userCredibility, votedUp, votedDown }: VoteImpactIndicatorProps) {
    const getImpactMultiplier = (score: number) => {
        if (score > 75) return { multiplier: 2.0, label: 'High Impact', color: 'text-emerald-600' };
        if (score >= 50) return { multiplier: 1.0, label: 'Standard Impact', color: 'text-blue-600' };
        if (score >= 25) return { multiplier: 0.5, label: 'Low Impact', color: 'text-gray-600' };
        return { multiplier: 0.25, label: 'Minimal Impact', color: 'text-amber-600' };
    };

    const impact = getImpactMultiplier(userCredibility);

    if (!votedUp && !votedDown) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`flex items-center gap-1 ${impact.color} text-xs font-medium`}>
                        {votedUp && <TrendingUp className="h-3 w-3" />}
                        {votedDown && <TrendingDown className="h-3 w-3" />}
                        <span>×{impact.multiplier.toFixed(1)}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-xs space-y-1">
                        <p className="font-semibold">{impact.label}</p>
                        <p className="text-muted-foreground">
                            Your vote counts {impact.multiplier}x due to your credibility score ({Math.round(userCredibility)}%)
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
