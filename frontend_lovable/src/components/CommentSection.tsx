import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ThumbsUp, ThumbsDown, Flag, Send, ShieldCheck } from 'lucide-react';
import { CredibilityScore } from './CredibilityScore';
import { toast } from 'sonner';
import { articlesAPI, commentsAPI } from '@/services/api';
import { UserTrustBadge } from './UserTrustBadge';
import { ReportModal } from './ReportModal';

interface CommentSectionProps {
  articleId: number;
}

interface Comment {
  id: number;
  content?: string;
  reason?: string;
  explanation?: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote?: number; // 1, -1, 0
  user?: {
    username: string;
    role: string;
    credibility_score?: number;
  };
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reportCommentId, setReportCommentId] = useState<number | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  const handleVote = async (commentId: number, type: 'up' | 'down') => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    try {
      const voteValue = type === 'up' ? 1 : -1;

      setComments(current => current.map(c => {
        if (c.id === commentId) {
          const currentVote = c.user_vote || 0;
          let newUpvotes = c.upvotes;
          let newDownvotes = c.downvotes;
          let newUserVote = currentVote;

          if (currentVote === voteValue) {
            // Toggle off
            newUserVote = 0;
            if (type === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
            else newDownvotes = Math.max(0, newDownvotes - 1);
          } else {
            // Change vote or New vote
            newUserVote = voteValue;
            if (currentVote === 1) newUpvotes = Math.max(0, newUpvotes - 1);
            if (currentVote === -1) newDownvotes = Math.max(0, newDownvotes - 1);

            if (type === 'up') newUpvotes += 1;
            else newDownvotes += 1;
          }

          return {
            ...c,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            user_vote: newUserVote
          };
        }
        return c;
      }));

      await commentsAPI.vote(commentId, type);
    } catch (error) {
      console.error('Failed to vote', error);
      toast.error('Failed to register vote');
      fetchComments(); // Revert on error
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await articlesAPI.getComments(articleId);
      setComments(res.data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    try {
      setSubmitting(true);
      await articlesAPI.comment(articleId, 'User Comment', newComment);
      setNewComment('');
      toast.success('Comment posted');
      fetchComments();
    } catch (error) {
      console.error('Failed to post comment', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Comment Form */}
      <div className="bg-secondary/20 p-4 rounded-lg border border-border/60">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarImage src={user ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}` : ''} />
              <AvatarFallback>{user ? user.username.substring(0, 2).toUpperCase() : '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share your analysis or feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] bg-background resize-none focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/20"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Keep discussions civil and fact-based.</p>
                <Button type="submit" disabled={submitting || !newComment.trim()} size="sm" className="bg-primary hover:bg-primary/90">
                  {submitting ? 'Posting...' : (
                    <>
                      <Send className="h-3.5 w-3.5 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Separator />

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground text-sm">Loading discussion...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-secondary/10 rounded-xl border border-dashed">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h4 className="font-medium text-foreground">No comments yet</h4>
            <p className="text-sm text-muted-foreground mt-1">Be the first to share your verification analysis.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="group animate-fade-in pl-4 border-l-2 border-border hover:border-accent transition-colors">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username || 'user'}`} />
                  <AvatarFallback>{comment.user?.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.user?.username || 'Unknown User'}</span>
                      {comment.user?.role === 'admin' && (
                        <ShieldCheck className="h-4 w-4 text-primary" title="Admin" />
                      )}
                      {comment.user?.credibility_score !== undefined && (
                        <UserTrustBadge score={comment.user.credibility_score} size="sm" showLabel={false} />
                      )}

                      <span className="text-xs text-muted-foreground">
                        • {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-foreground/90">
                    {comment.explanation || comment.reason || comment.content}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(comment.id, 'up')}
                      className={`h-8 px-2.5 text-xs rounded-full ${comment.user_vote === 1
                        ? 'text-green-600 bg-green-50'
                        : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'
                        }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 mr-1.5 ${comment.user_vote === 1 ? 'fill-current' : ''}`} />
                      {comment.upvotes || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(comment.id, 'down')}
                      className={`h-8 px-2.5 text-xs rounded-full ${comment.user_vote === -1
                        ? 'text-red-600 bg-red-50'
                        : 'text-muted-foreground hover:text-red-600 hover:bg-red-50'
                        }`}
                    >
                      <ThumbsDown className={`h-3.5 w-3.5 mr-1.5 ${comment.user_vote === -1 ? 'fill-current' : ''}`} />
                      {comment.downvotes || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReportCommentId(comment.id)}
                      className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground ml-auto rounded-full"
                    >
                      <Flag className="h-3.5 w-3.5 mr-1.5" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {reportCommentId && (
        <ReportModal
          articleTitle=""
          commentId={reportCommentId}
          onClose={() => setReportCommentId(null)}
        />
      )}
    </div>
  );
}

