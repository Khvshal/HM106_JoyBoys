import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Ban, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';

interface FlaggedUser {
    id: number;
    username: string;
    email: string;
    spam_score: number;
    flag_count: number;
    is_restricted: boolean;
    recent_activity: string[];
}

interface SpammerFlaggingUIProps {
    flaggedUsers: FlaggedUser[];
    onFlagUser?: (userId: number, reason: string) => Promise<void>;
    onUnflagUser?: (userId: number) => Promise<void>;
}

export function SpammerFlaggingUI({ flaggedUsers, onFlagUser, onUnflagUser }: SpammerFlaggingUIProps) {
    const [selectedUser, setSelectedUser] = useState<FlaggedUser | null>(null);
    const [flagReason, setFlagReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleFlag = async (userId: number) => {
        if (!flagReason.trim()) {
            toast.error('Please provide a reason');
            return;
        }

        setProcessing(true);
        try {
            await onFlagUser?.(userId, flagReason);
            toast.success('User flagged successfully');
            setSelectedUser(null);
            setFlagReason('');
        } catch (error) {
            toast.error('Failed to flag user');
        } finally {
            setProcessing(false);
        }
    };

    const handleUnflag = async (userId: number) => {
        setProcessing(true);
        try {
            await onUnflagUser?.(userId);
            toast.success('User unflagged');
        } catch (error) {
            toast.error('Failed to unflag user');
        } finally {
            setProcessing(false);
        }
    };

    const getSpamScoreColor = (score: number) => {
        if (score >= 70) return 'text-rose-600 bg-rose-50 border-rose-200';
        if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flaggedUsers.map((user) => (
                    <Card key={user.id} className={`${user.is_restricted ? 'border-rose-300 bg-rose-50/50' : ''}`}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{user.username}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Spam Score</span>
                                <Badge variant="outline" className={getSpamScoreColor(user.spam_score)}>
                                    {user.spam_score}%
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Flags</span>
                                <Badge variant="outline">{user.flag_count}</Badge>
                            </div>

                            {user.is_restricted && (
                                <div className="flex items-center gap-2 p-2 bg-rose-100 border border-rose-200 rounded text-xs text-rose-900">
                                    <Ban className="h-3 w-3" />
                                    <span>Restricted</span>
                                </div>
                            )}

                            <div className="pt-2 space-y-2">
                                {user.is_restricted ? (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                        onClick={() => handleUnflag(user.id)}
                                        disabled={processing}
                                    >
                                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                        Remove Restrictions
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                                        Flag User
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Flag User Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                Flag User: {selectedUser.username}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium block mb-2">Reason for Flagging</label>
                                <Textarea
                                    placeholder="Describe the spam/abuse behavior..."
                                    value={flagReason}
                                    onChange={(e) => setFlagReason(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900">
                                <strong>Note:</strong> Flagging will restrict this user's ability to vote and comment until reviewed.
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => handleFlag(selectedUser.id)}
                                    disabled={processing}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                                >
                                    Confirm Flag
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setFlagReason('');
                                    }}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
