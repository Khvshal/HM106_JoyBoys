from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from database import get_db
from models import Comment, CommentVote, User
from auth import get_current_user

router = APIRouter()

class VoteRequest(BaseModel):
    vote_type: str  # 'up', 'down', 'none' (to remove vote)

def get_token_from_header(authorization: Optional[str] = Header(None)):
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    return parts[1]

@router.post("/{comment_id}/vote")
def vote_comment(
    comment_id: int,
    vote_request: VoteRequest,
    request: Request,
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_header)
):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    current_user = get_current_user(token, db)
    
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
        
    # Check existing vote
    existing_vote = db.query(CommentVote).filter(
        CommentVote.comment_id == comment_id,
        CommentVote.user_id == current_user.id
    ).first()
    
    vote_val = 0
    if vote_request.vote_type == 'up':
        vote_val = 1
    elif vote_request.vote_type == 'down':
        vote_val = -1
        
    client_ip = request.client.host if request.client else None
        
    if existing_vote:
        # If trying to exact same vote, toggle off (or do nothing? treating as update)
        # Let's say if same vote, remove it. 
        if existing_vote.vote_value == vote_val:
             # Remove vote
             db.delete(existing_vote)
             if vote_val == 1:
                 comment.upvotes = max(0, comment.upvotes - 1)
             elif vote_val == -1:
                 comment.downvotes = max(0, comment.downvotes - 1)
        else:
            # changing vote
            # revert old
            if existing_vote.vote_value == 1:
                comment.upvotes = max(0, comment.upvotes - 1)
            elif existing_vote.vote_value == -1:
                comment.downvotes = max(0, comment.downvotes - 1)
                
            # apply new (if not none)
            if vote_val != 0:
                existing_vote.vote_value = vote_val
                existing_vote.ip_address = client_ip
                if vote_val == 1:
                    comment.upvotes += 1
                elif vote_val == -1:
                    comment.downvotes += 1
            else:
                 db.delete(existing_vote)
    else:
        # New vote
        if vote_val != 0:
            new_vote = CommentVote(
                comment_id=comment_id,
                user_id=current_user.id,
                vote_value=vote_val,
                ip_address=client_ip
            )
            db.add(new_vote)
            if vote_val == 1:
                comment.upvotes += 1
            elif vote_val == -1:
                comment.downvotes += 1
                
    db.commit()
    
    return {
        "status": "success", 
        "upvotes": comment.upvotes, 
        "downvotes": comment.downvotes,
        "user_vote": vote_request.vote_type
    }
