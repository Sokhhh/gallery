import React, { useState } from 'react';
import '../styles/comment.css';

const Comment = ({ comment, galleryId, imageId, handleEditComment, handleDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // Get the username and role from localStorage
  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('role') === 'admin'; // Assuming 'role' is stored as 'admin' for admins

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/galleries/${galleryId}/images/${imageId}/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const updatedComment = await response.json();
      handleEditComment(updatedComment); // Update the parent state with the edited comment
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update the comment');
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content); // Revert to original content
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/galleries/${galleryId}/images/${imageId}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      handleDeleteComment(comment.id); // Remove the comment from the parent state
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete the comment');
    }
  };

  // Only show edit and delete buttons if the current user is the author of the comment or an admin
  const canEditOrDelete = comment.username === username || isAdmin;

  return (
    <div className="comment-item">
      <p className="comment-author">{comment.username || 'Anonymous'}</p>
      
      {isEditing ? (
        <div className="comment-edit-container">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="comment-edit-textarea"
          />
          <button onClick={handleSaveEdit} className="save-comment-button">
            Save
          </button>
          <button onClick={handleCancelEdit} className="cancel-comment-button">
            Cancel
          </button>
        </div>
      ) : (
        <p className="comment-text">{comment.content}</p>
      )}

      {/* Conditionally render edit and delete buttons */}
      {canEditOrDelete && (
        <div className="comment-actions">
          <button onClick={() => setIsEditing(true)} className="edit-comment-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button onClick={handleDelete} className="delete-comment-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6L18 18M6 18L18 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const CommentInput = ({ newComment, setNewComment, handlePostComment }) => {
  return (
    <div className="comment-input-container">
      <input
        type="text"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="comment-input"
      />
      <button onClick={handlePostComment} className="post-comment-button">
        Post
      </button>
    </div>
  );
};

export { Comment, CommentInput };
