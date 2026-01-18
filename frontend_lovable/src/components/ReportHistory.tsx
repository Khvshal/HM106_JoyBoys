import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Report {
    id: number;
    article_title: string;
    reason: string;
    status: 'pending' | 'upheld' | 'rejected';
    submitted_at: string;
    reviewed_at?: string;
}

interface ReportHistoryProps {
    reports: Report[];
}

export function ReportHistory({ reports }: ReportHistoryProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upheld':
                return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="h-3 w-3 mr-1" /> Upheld</Badge>;
            case 'rejected':
                return <Badge className="bg-rose-100 text-rose-700 border-rose-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
            default:
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
        }
    };

    if (reports.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    <Flag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reports submitted yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Your Reports
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {reports.map((report) => (
                    <div key={report.id} className="p-3 rounded-lg border bg-secondary/20">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm line-clamp-1">{report.article_title}</h4>
                            {getStatusBadge(report.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{report.reason}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Submitted {new Date(report.submitted_at).toLocaleDateString()}</span>
                            {report.reviewed_at && (
                                <span>Reviewed {new Date(report.reviewed_at).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
