import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CommentForm = ({
  onSubmit,
  onCancel,
  loading = false,
  initialValue = '',
  placeholder = 'Write a comment...',
  submitLabel = 'Post Comment'
}) => {
  const [text, setText] = useState(initialValue);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionQuery, setMentionQuery] = useState('');
  const textareaRef = useRef(null);

  // Mock user data - in a real app, this would come from a service
  const mockUsers = [
    { id: 1, username: 'john_doe', name: 'John Doe' },
    { id: 2, username: 'jane_smith', name: 'Jane Smith' },
    { id: 3, username: 'mike_wilson', name: 'Mike Wilson' },
    { id: 4, username: 'sarah_davis', name: 'Sarah Davis' }
  ];

  useEffect(() => {
    // Focus textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  // Handle text change and detect @mentions
  const handleTextChange = (e) => {
    const newText = e.target.value;
    const newCursorPosition = e.target.selectionStart;
    
    setText(newText);
    setCursorPosition(newCursorPosition);

    // Check for @ mentions
    const textBeforeCursor = newText.substring(0, newCursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowUserSuggestions(true);
    } else {
      setShowUserSuggestions(false);
      setMentionQuery('');
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    const textBeforeCursor = text.substring(0, cursorPosition);
    const textAfterCursor = text.substring(cursorPosition);
    
    // Find the @ position
    const mentionStart = textBeforeCursor.lastIndexOf('@');
    const beforeMention = text.substring(0, mentionStart);
    const mentionText = `@${user.username} `;
    
    const newText = beforeMention + mentionText + textAfterCursor;
    const newCursorPosition = mentionStart + mentionText.length;
    
    setText(newText);
    setShowUserSuggestions(false);
    setMentionQuery('');
    
    // Focus back to textarea and set cursor position
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  // Filter users based on mention query
  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      return;
    }

    const commentData = {
      comment_text_c: text.trim(),
      reply_text_c: text.trim() // For replies, same content
    };

    onSubmit(commentData);
    
    if (!initialValue) {
      setText(''); // Clear form only for new comments, not edits
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            disabled={loading}
          />
          
          {/* User Suggestions Dropdown */}
          {showUserSuggestions && filteredUsers.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredUsers.slice(0, 5).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={12} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <ApperIcon name="AtSign" size={12} />
            <span>Use @username to mention someone</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !text.trim()}
              size="sm"
              className="flex items-center space-x-2"
            >
              {loading && <ApperIcon name="Loader2" size={14} className="animate-spin" />}
              <span>{loading ? 'Posting...' : submitLabel}</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-xs text-gray-400 text-right">
        Press Ctrl+Enter to submit, Esc to cancel
      </div>
    </div>
  );
};

export default CommentForm;