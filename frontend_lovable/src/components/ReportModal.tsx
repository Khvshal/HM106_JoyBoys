import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Flag, X } from 'lucide-react';
import { toast } from 'sonner';
import { articlesAPI } from '@/services/api';

interface ReportModalProps {
    articleId: number;
    articleTitle: string;
    onClose: () => void;
}

const REPORT_REASONS = [
    { value: 'sensationalism', label: 'Sensationalist Language', desc: 'Clickbait or emotionally manipulative' },
    { value: 'poor_sourcing', label: 'Poor Sourcing', desc: 'No credible sources cited' },
    { value: 'outdated', label: 'Outdated Information', desc: 'No longer accurate or relevant' },
    { value: 'misleading', label: 'Misleading Claims', desc: 'Distorts facts or context' },
    { value: 'unverified', label: 'Unverified Claims', desc: 'Lacks evidence or corroboration' },
    { value: 'biased', label: 'Strong Bias', desc: 'One-sided without balance' },
    { value: 'spam', label: 'Spam/Low Quality', desc: 'Not genuine news content' }
];

export function ReportModal({ articleId, articleTitle, onClose }: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [explanation, setExplanation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) {
            toast.error('Please select a reason');
            return;
        }

        setSubmitting(true);
        try {
            await articlesAPI.report(articleId, selectedReason, explanation);
            toast.success('Report submitted successfully', {
                description: 'An admin will review your report soon.'
            });
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to submit report');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b bg-secondary/20 flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-rose-600" />
                        <CardTitle>Report Article</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                    <div className="bg-secondary/20 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-1">Reporting:</p>
                        <p className="text-sm text-muted-foreground italic line-clamp-2">"{articleTitle}"</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold block">Select Issue Type *</label>
                        <div className="grid gap-2">
                            {REPORT_REASONS.map((reason) => (
                                <button
                                    key={reason.value}
                                    onClick={() => setSelectedReason(reason.value)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedReason === reason.value
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">{reason.label}</span>
                                        {selectedReason === reason.value && (
                                            <Badge variant="default" className="text-xs">Selected</Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{reason.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold block">Additional Details (Optional)</label>
                        <Textarea
                            placeholder="Provide any additional context that would help moderators review this article..."
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-900">
                            <strong>Note:</strong> False reports may affect your credibility score. Reports are reviewed by moderators.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedReason || submitting}
                            className="flex-1 bg-rose-600 hover:bg-rose-700"
                        >
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                        <Button variant="outline" onClick={onClose} disabled={submitting}>
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
