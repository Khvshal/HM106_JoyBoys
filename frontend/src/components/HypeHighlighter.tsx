import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Info } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HypeHighlighterProps {
    content: string;
    className?: string;
}

// Categorized Hype Words
const HYPE_PATTERNS = [
    {
        category: "Sensationalism",
        words: ["shocking", "amazing", "unbelievable", "mind-blowing", "insane", "bizarre", "miracle"],
        description: "Emotionally charged language designed to provoke curiosity."
    },
    {
        category: "Urgency",
        words: ["urgent", "breaking", "exclusive", "now", "immediately", "alert"],
        description: "Words creating artificial time pressure."
    },
    {
        category: "Exaggeration",
        words: ["explosive", "destroy", "obliterate", "nightmare", "best", "worst", "never seen before"],
        description: "Hyperbolic terms that oversell the content."
    },
    {
        category: "Clickbait",
        words: ["viral", "scandal", "exposed", "secret", "you won't believe", "what happened next"],
        description: "Phrases typical of click-driven headlines."
    }
];

export function HypeHighlighter({ content, className }: HypeHighlighterProps) {
    const [isEnabled, setIsEnabled] = useState(false);

    // Flatten words for regex
    const allHypeWords = HYPE_PATTERNS.flatMap(p => p.words);

    const getMatchCategory = (word: string) => {
        return HYPE_PATTERNS.find(p => p.words.some(w => w.toLowerCase() === word.toLowerCase()));
    };

    // Function to highlight text
    const getHighlightedText = (text: string) => {
        if (!isEnabled) return text;

        const parts = text.split(new RegExp(`(${allHypeWords.join('|')})`, 'gi'));

        return parts.map((part, i) => {
            const category = getMatchCategory(part);
            if (category) {
                return (
                    <TooltipProvider key={i} delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className="bg-yellow-200 text-yellow-900 border-b-2 border-yellow-500 px-1 rounded cursor-help transition-colors hover:bg-yellow-300"
                                >
                                    {part}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs p-3">
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm flex items-center gap-2">
                                        <Sparkles className="h-3.5 w-3.5 text-yellow-600" />
                                        {category.category}
                                    </p>
                                    <p className="text-xs opacity-90">{category.description}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            }
            return part;
        });
    };

    return (
        <div className={cn("relative", className)}>
            <div className="flex justify-end mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={cn(
                        "text-xs gap-2 transition-all border-dashed shadow-sm",
                        isEnabled ? "bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {isEnabled ? (
                        <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Hide Hype Analysis
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                            Detect Hype & Sensationalism
                        </>
                    )}
                </Button>
            </div>

            <div className={cn("prose prose-slate max-w-none text-foreground/90 leading-relaxed transition-opacity duration-300", isEnabled ? "opacity-100" : "opacity-95")}>
                {isEnabled ? (
                    <div>{getHighlightedText(content)}</div>
                ) : (
                    // Render regular content preserving newlines
                    content.split('\n').map((line, i) => (
                        <p key={i} className="mb-4 whitespace-pre-wrap">{line}</p>
                    ))
                )}
            </div>
        </div>
    );
}
