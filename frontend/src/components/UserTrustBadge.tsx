import { Badge } from '@/components/ui/badge';
import { Shield, Award, AlertTriangle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserTrustBadgeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function UserTrustBadge({ score, size = 'sm', showLabel = true }: UserTrustBadgeProps) {
    const getTrustLevel = (score: number) => {
        if (score >= 75) return { level: 'high', label: 'Trusted', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: Shield };
        if (score >= 50) return { level: 'medium', label: 'Verified', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Award };
        if (score >= 25) return { level: 'low', label: 'New', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: Shield };
        return { level: 'unverified', label: 'Unverified', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertTriangle };
    };

    const trust = getTrustLevel(score);
    const Icon = trust.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5'
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-3.5 w-3.5',
        lg: 'h-4 w-4'
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant="outline"
                        className={`${trust.color} ${sizeClasses[size]} font-medium border flex items-center gap-1.5`}
                    >
                        <Icon className={iconSizes[size]} />
                        {showLabel && <span>{trust.label}</span>}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-xs space-y-1">
                        <p className="font-semibold">User Credibility: {Math.round(score)}%</p>
                        <p className="text-muted-foreground">
                            {score >= 75 && "Highly reliable contributor with proven accuracy"}
                            {score >= 50 && score < 75 && "Verified member with good track record"}
                            {score >= 25 && score < 50 && "New member building credibility"}
                            {score < 25 && "Limited history or inconsistent ratings"}
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
