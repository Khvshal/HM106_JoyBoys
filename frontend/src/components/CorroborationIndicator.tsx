import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ExternalLink, Shield } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CorroboratingSource {
    name: string;
    trust_score: number;
    url?: string;
}

interface CorroborationIndicatorProps {
    sources: CorroboratingSource[];
    mainClaim?: string;
}

export function CorroborationIndicator({ sources, mainClaim }: CorroborationIndicatorProps) {
    const trustedSources = sources.filter(s => s.trust_score >= 70);
    const moderateSources = sources.filter(s => s.trust_score >= 45 && s.trust_score < 70);

    const weightedScore = sources.reduce((acc, s) => acc + (s.trust_score / 100), 0);
    const corroborationStrength = Math.min(100, (weightedScore / sources.length) * 100);

    const getStrengthColor = () => {
        if (corroborationStrength >= 70) return 'border-emerald-500 bg-emerald-50';
        if (corroborationStrength >= 45) return 'border-amber-500 bg-amber-50';
        return 'border-gray-400 bg-gray-50';
    };

    const getStrengthLabel = () => {
        if (corroborationStrength >= 70) return 'Strong Corroboration';
        if (corroborationStrength >= 45) return 'Moderate Corroboration';
        return 'Limited Corroboration';
    };

    return (
        <Card className={`border-l-4 ${getStrengthColor()}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        Cross-Source Verification
                    </CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge variant="outline" className="gap-1">
                                    <Shield className="h-3 w-3" />
                                    {getStrengthLabel()}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs max-w-xs">
                                    Corroboration strength is weighted by source reliability.
                                    Higher-trust sources contribute more to the overall score.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {mainClaim && (
                    <div className="text-sm bg-secondary/50 p-3 rounded-lg italic text-muted-foreground">
                        "{mainClaim}"
                    </div>
                )}

                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Supported by {sources.length} independent source{sources.length !== 1 ? 's' : ''}:
                    </p>

                    <div className="space-y-2">
                        {sources.map((source, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-background border">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${source.trust_score >= 70 ? 'bg-emerald-500' :
                                            source.trust_score >= 45 ? 'bg-amber-500' : 'bg-gray-400'
                                        }`} />
                                    <span className="text-sm font-medium truncate">{source.name}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {source.trust_score}%
                                    </span>
                                    {source.url && (
                                        <a
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                            {trustedSources.length} highly trusted • {moderateSources.length} moderate
                        </span>
                        <span className="font-semibold">
                            Weighted Score: {Math.round(corroborationStrength)}%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
