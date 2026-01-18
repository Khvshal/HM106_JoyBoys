import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flag, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
    id: number;
    article_id: number;
    article_title: string;
    reporter_username: string;
    reason: string;
    explanation: string;
    status: 'pending' | 'upheld' | 'rejected';
    submitted_at: string;
}

interface AdminReportsManagementProps {
    reports: Report[];
    onResolve: (reportId: number, decision: 'upheld' | 'rejected') => Promise<void>;
}

export function AdminReportsManagement({ reports, onResolve }: AdminReportsManagementProps) {
    const [processing, setProcessing] = useState<number | null>(null);

    const pendingReports = reports.filter(r => r.status === 'pending');
    const resolvedReports = reports.filter(r => r.status !== 'pending');

    const handleResolve = async (reportId: number, decision: 'upheld' | 'rejected') => {
        setProcessing(reportId);
        try {
            await onResolve(reportId, decision);
            toast.success(`Report ${decision}`);
        } catch (error) {
            toast.error('Failed to resolve report');
        } finally {
            setProcessing(null);
        }
    };

    const ReportCard = ({ report }: { report: Report }) => (
        <Card className="overflow-hidden">
            <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Flag className="h-4 w-4 text-rose-600" />
                                <span className="text-xs text-muted-foreground">
                                    Reported by <span className="font-medium text-foreground">{report.reporter_username}</span>
                                </span>
                            </div>
                            <h4 className="font-semibold mb-2 line-clamp-2">{report.article_title}</h4>
                            <div className="space-y-1">
                                <Badge variant="outline" className="text-xs">{report.reason}</Badge>
                                {report.explanation && (
                                    <p className="text-sm text-muted-foreground mt-2 italic">"{report.explanation}"</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-muted-foreground">
                            {new Date(report.submitted_at).toLocaleString()}
                        </span>

                        {report.status === 'pending' ? (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                    onClick={() => handleResolve(report.id, 'upheld')}
                                    disabled={processing === report.id}
                                >
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Uphold
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                                    onClick={() => handleResolve(report.id, 'rejected')}
                                    disabled={processing === report.id}
                                >
                                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Reject
                                </Button>
                            </div>
                        ) : (
                            <Badge className={report.status === 'upheld' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                                {report.status === 'upheld' ? 'Upheld' : 'Rejected'}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="pending">
                    Pending <Badge variant="secondary" className="ml-2">{pendingReports.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="resolved">
                    Resolved <Badge variant="secondary" className="ml-2">{resolvedReports.length}</Badge>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
                {pendingReports.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-500/50" />
                        <h3 className="text-lg font-medium">All Caught Up!</h3>
                        <p className="text-muted-foreground">No pending reports to review</p>
                    </div>
                ) : (
                    pendingReports.map(report => <ReportCard key={report.id} report={report} />)
                )}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
                {resolvedReports.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No resolved reports yet</p>
                    </div>
                ) : (
                    resolvedReports.map(report => <ReportCard key={report.id} report={report} />)
                )}
            </TabsContent>
        </Tabs>
    );
}
