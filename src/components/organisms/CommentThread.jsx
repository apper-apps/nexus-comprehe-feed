import React, { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import CommentForm from '@/components/organisms/CommentForm';

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
          <div className="ml-10 flex items-center space-x-4">
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

export default CommentThread;