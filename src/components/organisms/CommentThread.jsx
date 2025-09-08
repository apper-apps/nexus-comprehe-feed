import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import * as reactionService from "@/services/api/reactionService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import CommentForm from "@/components/organisms/CommentForm";

const CommentThread = ({
  comment,
  replies = [],
  currentUser,
  onCreateReply,
  onUpdateComment,
  onUpdateReply,
  onDeleteComment,
  onDeleteReply
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [editingReply, setEditingReply] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);

  // Check if current user can edit/delete comment
  const canEditComment = currentUser?.userId && (
    comment.CreatedBy?.Id === currentUser.userId ||
    comment.user_id_c?.Id === currentUser.userId ||
    comment.user_id_c === currentUser.userId
  );

  // Handle reply submission
  const handleReplySubmit = async (replyData) => {
    try {
      setReplyLoading(true);
      await onCreateReply(replyData);
      setShowReplyForm(false);
    } finally {
      setReplyLoading(false);
    }
  };

  // Handle comment update
  const handleCommentUpdate = async (commentData) => {
    try {
      await onUpdateComment({
        Name: comment.Name,
        user_id_c: comment.user_id_c?.Id || comment.user_id_c,
        comment_text_c: commentData.comment_text_c
      });
      setEditingComment(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // Handle reply update
  const handleReplyUpdate = async (replyId, replyData) => {
    try {
      const reply = replies.find(r => r.Id === replyId);
      await onUpdateReply(replyId, {
        Name: reply.Name,
        user_id_c: reply.user_id_c?.Id || reply.user_id_c,
        reply_text_c: replyData.reply_text_c
      });
      setEditingReply(null);
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  // Check if user can edit/delete reply
  const canEditReply = (reply) => {
    return currentUser?.userId && (
      reply.CreatedBy?.Id === currentUser.userId ||
      reply.user_id_c?.Id === currentUser.userId ||
      reply.user_id_c === currentUser.userId
    );
  };

  // Format user display name
  const getUserDisplayName = (userField, createdBy) => {
    if (userField?.Name) return userField.Name;
    if (createdBy?.Name) return createdBy.Name;
    if (typeof userField === 'number' && createdBy?.Name) return createdBy.Name;
    return 'Unknown User';
  };

  // Process text with mentions
  const processTextWithMentions = (text) => {
    if (!text) return text;
    
    return text.replace(/@(\w+)/g, (match, username) => {
      return `<span class="bg-primary-100 text-primary-700 px-1 rounded font-medium">${match}</span>`;
    });
  };

  return (
    <Card className="p-4">
      {/* Main Comment */}
      <div className="space-y-3">
        {/* Comment Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {getUserDisplayName(comment.user_id_c, comment.CreatedBy)}
              </p>
              <p className="text-sm text-gray-500">
                {comment.CreatedOn ? format(new Date(comment.CreatedOn), 'MMM d, yyyy at h:mm a') : 'Unknown date'}
                {comment.ModifiedOn && comment.ModifiedOn !== comment.CreatedOn && (
                  <span className="ml-2 text-gray-400">(edited)</span>
                )}
              </p>
            </div>
          </div>
          {canEditComment && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingComment(true)}
                className="p-1"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteComment}
                className="p-1 text-error-600 hover:text-error-700"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="ml-10">
          {editingComment ? (
            <CommentForm
              initialValue={comment.comment_text_c}
              onSubmit={handleCommentUpdate}
              onCancel={() => setEditingComment(false)}
              placeholder="Edit your comment..."
              submitLabel="Update Comment"
            />
          ) : (
            <div
              className="text-gray-700 whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: processTextWithMentions(comment.comment_text_c)
              }}
            />
          )}
        </div>

        {/* Comment Actions */}
{!editingComment && (
          <div className="ml-10 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-primary-600 hover:text-primary-700 p-0 h-auto font-medium"
              >
                <ApperIcon name="Reply" size={14} className="mr-1" />
                Reply
              </Button>
              {replies.length > 0 && (
                <span className="text-sm text-gray-500">
                  {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                </span>
              )}
            </div>
            
            {/* Reaction Buttons */}
            <ReactionButtons 
              comment={comment} 
              currentUser={currentUser}
            />
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <div className="ml-10 mt-4 bg-gray-50 rounded-lg p-3">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
              loading={replyLoading}
              placeholder="Write a reply... Use @username to mention someone"
              submitLabel="Reply"
            />
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="ml-10 space-y-3 mt-4 border-l-2 border-gray-200 pl-4">
            {replies.map((reply) => (
<div key={reply.Id} className="space-y-2">
                {/* Reply Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {getUserDisplayName(reply.user_id_c, reply.CreatedBy)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {reply.CreatedOn ? format(new Date(reply.CreatedOn), 'MMM d, yyyy at h:mm a') : 'Unknown date'}
                        {reply.ModifiedOn && reply.ModifiedOn !== reply.CreatedOn && (
                          <span className="ml-2 text-gray-400">(edited)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {canEditReply(reply) && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingReply(reply.Id)}
                        className="p-1"
                      >
                        <ApperIcon name="Edit2" size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteReply(reply.Id)}
                        className="p-1 text-error-600 hover:text-error-700"
                      >
                        <ApperIcon name="Trash2" size={12} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Reply Content */}
                <div className="ml-8">
                  {editingReply === reply.Id ? (
                    <CommentForm
                      initialValue={reply.reply_text_c}
                      onSubmit={(replyData) => handleReplyUpdate(reply.Id, replyData)}
                      onCancel={() => setEditingReply(null)}
                      placeholder="Edit your reply..."
                      submitLabel="Update Reply"
                    />
                  ) : (
                    <div
                      className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: processTextWithMentions(reply.reply_text_c)
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
)}
      </div>
    </Card>
  );
};

// Reaction Buttons Component
const ReactionButtons = ({ comment, currentUser }) => {
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userReaction, setUserReaction] = useState(null);

  // Load reactions for this comment
  useEffect(() => {
    loadReactions();
  }, [comment.Id]);

  const loadReactions = async () => {
    try {
      const commentReactions = await reactionService.getByCommentId(comment.Id);
      setReactions(commentReactions);
      
      // Find current user's reaction
      const currentUserId = currentUser?.userId || currentUser?.Id;
      const currentUserReaction = commentReactions.find(reaction => {
        const reactionUserId = reaction.user_id_c?.Id || reaction.user_id_c;
        return reactionUserId === currentUserId;
      });
      setUserReaction(currentUserReaction);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (reactionType) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const currentUserId = currentUser?.userId || currentUser?.Id;
      
      // If user already has this reaction, remove it
      if (userReaction && userReaction.reaction_type_c === reactionType) {
        await reactionService.delete_(userReaction.Id);
        toast.success('Reaction removed');
      }
      // If user has different reaction, update it
      else if (userReaction && userReaction.reaction_type_c !== reactionType) {
        await reactionService.update(userReaction.Id, {
          Name_c: `${reactionType} reaction`,
          reaction_type_c: reactionType
        });
        toast.success('Reaction updated');
      }
      // If user has no reaction, create new one
      else {
        await reactionService.create({
          Name_c: `${reactionType} reaction`,
          comment_id_c: comment.Id,
          user_id_c: currentUserId,
          reaction_type_c: reactionType
        });
        toast.success('Reaction added');
      }
      
      // Reload reactions to update UI
      await loadReactions();
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to update reaction');
    } finally {
      setLoading(false);
    }
  };

  // Count reactions by type
  const likeCount = reactions.filter(r => r.reaction_type_c === 'Like').length;
  const dislikeCount = reactions.filter(r => r.reaction_type_c === 'Dislike').length;

  return (
    <div className="flex items-center space-x-3">
      {/* Like Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('Like')}
        disabled={loading}
        className={`flex items-center space-x-1 p-1 h-auto ${
          userReaction?.reaction_type_c === 'Like' 
            ? 'text-success-600 bg-success-50' 
            : 'text-gray-500 hover:text-success-600'
        }`}
      >
        <ApperIcon 
          name="ThumbsUp" 
          size={14} 
          className={userReaction?.reaction_type_c === 'Like' ? 'text-success-600' : ''} 
        />
        {likeCount > 0 && <span className="text-xs font-medium">{likeCount}</span>}
      </Button>

      {/* Dislike Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleReaction('Dislike')}
        disabled={loading}
        className={`flex items-center space-x-1 p-1 h-auto ${
          userReaction?.reaction_type_c === 'Dislike' 
            ? 'text-error-600 bg-error-50' 
            : 'text-gray-500 hover:text-error-600'
        }`}
      >
        <ApperIcon 
          name="ThumbsDown" 
          size={14} 
          className={userReaction?.reaction_type_c === 'Dislike' ? 'text-error-600' : ''} 
        />
        {dislikeCount > 0 && <span className="text-xs font-medium">{dislikeCount}</span>}
      </Button>
    </div>
  );
};

export default CommentThread;

export default CommentThread;