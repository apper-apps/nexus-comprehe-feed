import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CommentThread from '@/components/organisms/CommentThread';
import CommentForm from '@/components/organisms/CommentForm';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import * as commentService from '@/services/api/commentService';
import * as replyService from '@/services/api/replyService';
import * as userMentionService from '@/services/api/userMentionService';

const CommentSystem = ({ dealId }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useSelector((state) => state.user);

  // Load comments and replies
  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const commentsData = await commentService.getByDealId(dealId);
      setComments(commentsData || []);

      // Load replies for each comment
      const repliesData = {};
      await Promise.all(
        (commentsData || []).map(async (comment) => {
          try {
            const commentReplies = await replyService.getByCommentId(comment.Id);
            repliesData[comment.Id] = commentReplies || [];
          } catch (error) {
            console.error(`Error loading replies for comment ${comment.Id}:`, error);
            repliesData[comment.Id] = [];
          }
        })
      );
      
      setReplies(repliesData);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments');
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dealId) {
      loadComments();
    }
  }, [dealId]);

  // Create new comment
  const handleCreateComment = async (commentData) => {
    if (!user?.userId) {
      toast.error('You must be logged in to comment');
      return;
    }

    try {
      setSubmitting(true);

      // Extract mentions from comment text
      const mentions = extractMentions(commentData.comment_text_c);

      // Create comment
      const newComment = await commentService.create({
        Name: `Comment by ${user.firstName} ${user.lastName}`,
        deal_id_c: dealId,
        user_id_c: user.userId,
        comment_text_c: commentData.comment_text_c
      });

      if (newComment) {
        // Create user mentions if any
        if (mentions.length > 0) {
          await createUserMentions(mentions, newComment.Id, null);
        }

        await loadComments(); // Reload to get updated data
        setShowCommentForm(false);
        toast.success('Comment added successfully');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Create reply
  const handleCreateReply = async (commentId, replyData) => {
    if (!user?.userId) {
      toast.error('You must be logged in to reply');
      return;
    }

    try {
      // Extract mentions from reply text
      const mentions = extractMentions(replyData.reply_text_c);

      // Create reply
      const newReply = await replyService.create({
        Name: `Reply by ${user.firstName} ${user.lastName}`,
        comment_id_c: commentId,
        user_id_c: user.userId,
        reply_text_c: replyData.reply_text_c
      });

      if (newReply) {
        // Create user mentions if any
        if (mentions.length > 0) {
          await createUserMentions(mentions, null, newReply.Id);
        }

        // Reload replies for the specific comment
        const updatedReplies = await replyService.getByCommentId(commentId);
        setReplies(prev => ({
          ...prev,
          [commentId]: updatedReplies || []
        }));
        
        toast.success('Reply added successfully');
      }
    } catch (error) {
      console.error('Error creating reply:', error);
      toast.error('Failed to add reply');
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId, commentData) => {
    try {
      const updatedComment = await commentService.update(commentId, {
        Name: commentData.Name,
        deal_id_c: dealId,
        user_id_c: commentData.user_id_c,
        comment_text_c: commentData.comment_text_c
      });

      if (updatedComment) {
        // Handle mentions update
        const mentions = extractMentions(commentData.comment_text_c);
        
        // Delete existing mentions for this comment
        await userMentionService.deleteByCommentId(commentId);
        
        // Create new mentions
        if (mentions.length > 0) {
          await createUserMentions(mentions, commentId, null);
        }

        await loadComments(); // Reload to get updated data
        toast.success('Comment updated successfully');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  // Update reply
  const handleUpdateReply = async (replyId, commentId, replyData) => {
    try {
      const updatedReply = await replyService.update(replyId, {
        Name: replyData.Name,
        comment_id_c: commentId,
        user_id_c: replyData.user_id_c,
        reply_text_c: replyData.reply_text_c
      });

      if (updatedReply) {
        // Handle mentions update
        const mentions = extractMentions(replyData.reply_text_c);
        
        // Delete existing mentions for this reply
        await userMentionService.deleteByReplyId(replyId);
        
        // Create new mentions
        if (mentions.length > 0) {
          await createUserMentions(mentions, null, replyId);
        }

        // Reload replies for the specific comment
        const updatedReplies = await replyService.getByCommentId(commentId);
        setReplies(prev => ({
          ...prev,
          [commentId]: updatedReplies || []
        }));
        
        toast.success('Reply updated successfully');
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      toast.error('Failed to update reply');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment? This will also delete all replies.')) {
      return;
    }

    try {
      // Delete all mentions for this comment
      await userMentionService.deleteByCommentId(commentId);
      
      // Delete all replies for this comment
      const commentReplies = replies[commentId] || [];
      await Promise.all(
        commentReplies.map(async (reply) => {
          await userMentionService.deleteByReplyId(reply.Id);
          await replyService.delete_(reply.Id);
        })
      );

      // Delete the comment
      const success = await commentService.delete_(commentId);
      
      if (success) {
        await loadComments(); // Reload to get updated data
        toast.success('Comment deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  // Delete reply
  const handleDeleteReply = async (replyId, commentId) => {
    if (!confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      // Delete mentions for this reply
      await userMentionService.deleteByReplyId(replyId);
      
      // Delete the reply
      const success = await replyService.delete_(replyId);
      
      if (success) {
        // Reload replies for the specific comment
        const updatedReplies = await replyService.getByCommentId(commentId);
        setReplies(prev => ({
          ...prev,
          [commentId]: updatedReplies || []
        }));
        
        toast.success('Reply deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply');
    }
  };

  // Extract @mentions from text
  const extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]); // Extract username without @
    }
    
    return [...new Set(mentions)]; // Remove duplicates
  };

  // Create user mentions
  const createUserMentions = async (mentions, commentId, replyId) => {
    if (mentions.length === 0) return;

    try {
      const mentionData = mentions.map(username => ({
        Name: `Mention ${username}`,
        user_id_c: getUserIdByUsername(username), // This would need to be implemented
        comment_id_c: commentId,
        reply_id_c: replyId
      }));

      await userMentionService.createBulk(mentionData);
    } catch (error) {
      console.error('Error creating user mentions:', error);
    }
  };

  // Helper function to get user ID by username
  const getUserIdByUsername = (username) => {
    // This is a placeholder - in a real implementation, you would
    // have a user service to look up user IDs by username
    // For now, return a default user ID
    return user?.userId || 1;
  };

  if (loading) {
    return <Loading message="Loading comments..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="AlertCircle" className="h-12 w-12 text-error-500 mx-auto mb-4" />
        <p className="text-error-600 mb-4">{error}</p>
        <Button variant="primary" onClick={loadComments}>
          Retry
        </Button>
      </div>
    );
  }

  const totalComments = comments.length + Object.values(replies).reduce((sum, replyArray) => sum + replyArray.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ApperIcon name="MessageSquare" className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Comments {totalComments > 0 && `(${totalComments})`}
          </h3>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCommentForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Comment</span>
        </Button>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <CommentForm
            onSubmit={handleCreateComment}
            onCancel={() => setShowCommentForm(false)}
            loading={submitting}
            placeholder="Write a comment... Use @username to mention someone"
          />
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <Empty
          icon="MessageSquare"
          title="No comments yet"
          description="Start the conversation by adding the first comment"
          action={
            <Button variant="primary" onClick={() => setShowCommentForm(true)}>
              Add First Comment
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentThread
              key={comment.Id}
              comment={comment}
              replies={replies[comment.Id] || []}
              currentUser={user}
              onCreateReply={(replyData) => handleCreateReply(comment.Id, replyData)}
              onUpdateComment={(commentData) => handleUpdateComment(comment.Id, commentData)}
              onUpdateReply={(replyId, replyData) => handleUpdateReply(replyId, comment.Id, replyData)}
              onDeleteComment={() => handleDeleteComment(comment.Id)}
              onDeleteReply={(replyId) => handleDeleteReply(replyId, comment.Id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSystem;