import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

interface SoftLockBannerProps {
    reason: string;
    showDetails?: boolean;
}

export function SoftLockBanner({ reason, showDetails = true }: SoftLockBannerProps) {
    return (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20 mb-6 animate-slide-down">
            <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <AlertTitle className="text-amber-900 dark:text-amber-100 font-semibold mb-1 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Credibility Under Verification
                    </AlertTitle>
                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                        {showDetails ? (
                            <>
                                <p className="mb-2">
                                    This article's credibility score is temporarily suspended due to: <strong>{reason}</strong>
                                </p>
                                <p className="text-xs">
                                    Our moderators are reviewing the situation. While under verification, new votes and comments are still welcome but may have reduced impact on the credibility score.
                                </p>
                            </>
                        ) : (
                            <p>Credibility verification in progress. Normal scoring will resume after review.</p>
                        )}
                    </AlertDescription>

                    <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 dark:text-amber-300">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Estimated review time: 24-48 hours</span>
                    </div>
                </div>
            </div>
        </Alert>
    );
}
