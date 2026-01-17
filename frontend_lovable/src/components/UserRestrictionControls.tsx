import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ban, Unlock, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UserRestriction {
    user_id: number;
    username: string;
    restriction_type: 'temporary_ban' | 'vote_restriction' | 'comment_restriction' | 'full_ban';
    reason: string;
    expires_at?: string;
    imposed_at: string;
}

interface UserRestrictionControlsProps {
    restrictions: UserRestriction[];
    onRestrict?: (userId: number, type: string, reason: string, duration?: number) => Promise<void>;
    onUnrestrict?: (userId: number) => Promise<void>;
}

export function UserRestrictionControls({ restrictions, onRestrict, onUnrestrict }: UserRestrictionControlsProps) {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [restrictionType, setRestrictionType] = useState('vote_restriction');
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('7');
    const [processing, setProcessing] = useState(false);

    const handleRestrict = async () => {
        if (!selectedUser || !reason.trim()) {
            toast.error('Please provide all required information');
            return;
        }

        setProcessing(true);
        try {
            await onRestrict?.(selectedUser, restrictionType, reason, parseInt(duration));
            toast.success('Restriction applied');
            setShowModal(false);
            resetForm();
        } catch (error) {
            toast.error('Failed to apply restriction');
        } finally {
            setProcessing(false);
        }
    };

    const handleUnrestrict = async (userId: number) => {
        setProcessing(true);
        try {
            await onUnrestrict?.(userId);
            toast.success('Restriction removed');
        } catch (error) {
            toast.error('Failed to remove restriction');
        } finally {
            setProcessing(false);
        }
    };

    const resetForm = () => {
        setSelectedUser(null);
        setRestrictionType('vote_restriction');
        setReason('');
        setDuration('7');
    };

    const getRestrictionBadge = (type: string) => {
        const badges: Record<string, { label: string; className: string }> = {
            temporary_ban: { label: 'Temporary Ban', className: 'bg-rose-100 text-rose-700 border-rose-200' },
            vote_restriction: { label: 'Vote Restricted', className: 'bg-amber-100 text-amber-700 border-amber-200' },
            comment_restriction: { label: 'Comment Restricted', className: 'bg-orange-100 text-orange-700 border-orange-200' },
            full_ban: { label: 'Permanently Banned', className: 'bg-gray-900 text-white border-gray-900' },
        };
        const badge = badges[type] || badges.temporary_ban;
        return <Badge variant="outline" className={badge.className}>{badge.label}</Badge>;
    };

    const isExpired = (expiresAt?: string) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Restrictions</h3>
                <Button onClick={() => setShowModal(true)} className="gap-2">
                    <Ban className="h-4 w-4" />
                    Apply Restriction
                </Button>
            </div>

            {restrictions.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <Unlock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No active restrictions</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {restrictions.map((restriction, idx) => (
                        <Card key={idx}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{restriction.username}</h4>
                                            {getRestrictionBadge(restriction.restriction_type)}
                                        </div>

                                        <p className="text-sm text-muted-foreground">{restriction.reason}</p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Imposed {new Date(restriction.imposed_at).toLocaleDateString()}</span>
                                            {restriction.expires_at && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {isExpired(restriction.expires_at) ? (
                                                        <span className="text-rose-600">Expired</span>
                                                    ) : (
                                                        `Expires ${new Date(restriction.expires_at).toLocaleDateString()}`
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUnrestrict(restriction.user_id)}
                                        disabled={processing}
                                        className="ml-4"
                                    >
                                        <Unlock className="h-3.5 w-3.5 mr-1.5" />
                                        Remove
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Restriction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2">
                                <Ban className="h-5 w-5 text-rose-600" />
                                Apply User Restriction
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium block mb-2">User ID</label>
                                <Input
                                    type="number"
                                    placeholder="Enter user ID"
                                    onChange={(e) => setSelectedUser(parseInt(e.target.value))}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-2">Restriction Type</label>
                                <Select value={restrictionType} onValueChange={setRestrictionType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vote_restriction">Vote Restriction</SelectItem>
                                        <SelectItem value="comment_restriction">Comment Restriction</SelectItem>
                                        <SelectItem value="temporary_ban">Temporary Ban</SelectItem>
                                        <SelectItem value="full_ban">Permanent Ban</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {restrictionType !== 'full_ban' && (
                                <div>
                                    <label className="text-sm font-medium block mb-2">Duration (days)</label>
                                    <Input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        min="1"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium block mb-2">Reason</label>
                                <Input
                                    placeholder="Reason for restriction..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <div className="bg-rose-50 border border-rose-200 rounded p-3 text-xs text-rose-900">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Warning:</strong> This action will immediately restrict the user's ability to interact with the platform. Ensure you have sufficient evidence.
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleRestrict}
                                    disabled={processing}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                                >
                                    Apply Restriction
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
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
