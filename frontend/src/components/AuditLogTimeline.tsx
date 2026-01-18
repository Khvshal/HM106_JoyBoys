import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, Shield, User } from 'lucide-react';

interface AuditEntry {
    id: number;
    timestamp: string;
    change_type: string;
    old_score?: number;
    new_score?: number;
    reason: string;
    changed_by?: string;
}

interface AuditLogTimelineProps {
    entries: AuditEntry[];
}

export function AuditLogTimeline({ entries }: AuditLogTimelineProps) {
    const getIcon = (changeType: string) => {
        switch (changeType) {
            case 'score_increase':
                return <TrendingUp className="h-4 w-4 text-emerald-600" />;
            case 'score_decrease':
                return <TrendingDown className="h-4 w-4 text-rose-600" />;
            case 'soft_lock':
                return <AlertTriangle className="h-4 w-4 text-amber-600" />;
            case 'admin_override':
                return <Shield className="h-4 w-4 text-blue-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (entries.length === 0) {
        return (
            <Card className="bg-secondary/20">
                <CardContent className="pt-6 text-center text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No credibility changes recorded yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map((entry, index) => (
                <div key={entry.id} className="relative">
                    {/* Timeline connector */}
                    {index < entries.length - 1 && (
                        <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
                    )}

                    <Card className="hover:shadow-sm transition-shadow">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                        {getIcon(entry.change_type)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="font-medium text-sm">
                                            {entry.change_type === 'score_increase' && 'Credibility Increased'}
                                            {entry.change_type === 'score_decrease' && 'Credibility Decreased'}
                                            {entry.change_type === 'soft_lock' && 'Under Verification'}
                                            {entry.change_type === 'admin_override' && 'Admin Override'}
                                            {entry.change_type === 'community_feedback' && 'Community Update'}
                                        </p>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDate(entry.timestamp)}
                                        </span>
                                    </div>

                                    {/* Score change */}
                                    {entry.old_score !== undefined && entry.new_score !== undefined && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs">
                                                {entry.old_score}%
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">→</span>
                                            <Badge variant="outline" className="text-xs">
                                                {entry.new_score}%
                                            </Badge>
                                            <span className={`text-xs font-semibold ${entry.new_score > entry.old_score ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                ({entry.new_score > entry.old_score ? '+' : ''}{entry.new_score - entry.old_score}%)
                                            </span>
                                        </div>
                                    )}

                                    {/* Reason */}
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {entry.reason}
                                    </p>

                                    {/* Changed by */}
                                    {entry.changed_by && (
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                                by {entry.changed_by}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}
