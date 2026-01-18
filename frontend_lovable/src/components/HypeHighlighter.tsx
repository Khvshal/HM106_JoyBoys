import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Info } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HypeHighlighterProps {
    content: string;
    hypeSentences?: string[];
    factualSentences?: string[];
    className?: string;
}

export function HypeHighlighter({ content, hypeSentences = [], factualSentences = [], className }: HypeHighlighterProps) {
    const [isEnabled, setIsEnabled] = useState(true);

    // Normalize comparison
    const clean = (s: string) => s.trim().toLowerCase();

    // Split content into segments (sentences/paragraphs) for rendering
    // We'll use a simple split by period but try to preserve structure
    // Actually, to ensure we match the backend's sentences, we might just iterate the text?
    // Given the difficulty of exact reconstruction, we'll try to split by the same logic or just use string search.

    // Better approach: 
    // 1. We know the sentences we want to highlight.
    // 2. We can look for them in the text and wrap them.
    // 3. Since React string replacement is complex, we'll split the content by the known sentences? No, they might be many.

    // Let's try splitting by sentence delimiters first, similar to backend.
    const splitRegex = /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/;
    const segments = content.split(splitRegex);

    return (
        <div className={cn("relative leading-loose", className)}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-serif">Article Analysis</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEnabled(!isEnabled)}
                    className="text-xs"
                >
                    {isEnabled ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {isEnabled ? 'Hide Highlights' : 'Show Highlights'}
                </Button>
            </div>

            <div className={cn("prose prose-lg max-w-none text-foreground/90 transition-all duration-500", !isEnabled && "opacity-100")}>
                {segments.map((segment, i) => {
                    const isHype = isEnabled && hypeSentences.some(h => clean(h) === clean(segment));
                    const isFact = isEnabled && factualSentences.some(f => clean(f) === clean(segment));

                    if (isHype) {
                        return (
                            <TooltipProvider key={i}>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span className="bg-rose-50 text-rose-900 px-1 py-0.5 rounded mx-0.5 box-decoration-clone cursor-help border-b-2 border-rose-100 transition-colors hover:bg-rose-100">
                                            {segment}{' '}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-rose-50 border-rose-100 text-rose-800">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            <span>Sensationalist / Subjective Language</span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    }
                    if (isFact) {
                        return (
                            <TooltipProvider key={i}>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span className="bg-emerald-50 text-emerald-900 px-1 py-0.5 rounded mx-0.5 box-decoration-clone cursor-help border-b-2 border-emerald-100 transition-colors hover:bg-emerald-100">
                                            {segment}{' '}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-emerald-50 border-emerald-100 text-emerald-800">
                                        <div className="flex items-center gap-2">
                                            <Info className="h-4 w-4" />
                                            <span>Factual Statement / Data</span>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    }
                    return <span key={i}>{segment} </span>;
                })}
            </div>

            {/* Legend */}
            {isEnabled && (
                <div className="mt-8 pt-4 border-t flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="text-muted-foreground">Factual / Data-driven</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="text-muted-foreground">High Hype / Editorialized</span>
                    </div>
                </div>
            )}
        </div>
    );
}
