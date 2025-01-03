import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TemplatePage from './templatePage'; // Use TemplatePage for consistent layout
import { Comment, CommentInput } from '../components/comment'; // Import the Comment components
import '../styles/viewImage.css';

const ViewImage = ({ galleryId: propGalleryId }) => {
    const { imageId, galleryId: paramGalleryId } = useParams(); // Retrieve imageId and galleryId from URL params
    const galleryId = propGalleryId || paramGalleryId; // Fallback to URL galleryId if prop is not passed
    const [image, setImage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const placeholderImage = 'https://via.placeholder.com/600x400?text=Image+Unavailable';
    
    // Retrieve username from localStorage
    const username = localStorage.getItem('username'); // Get the username from localStorage

    // Fetch image details and comments
    useEffect(() => {
        const fetchImageAndComments = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('Authentication required. Please login.');
                    setLoading(false);
                    return;
                }

                const imageResponse = await fetch(
                    `http://localhost:5000/api/galleries/${galleryId}/images/${imageId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    setImage(imageData);
                    console.log('Image URL:', imageData.url); // Log the image URL
                } else {
                    throw new Error('Failed to fetch image');
                }

                const commentsResponse = await fetch(
                    `http://localhost:5000/api/galleries/${galleryId}/images/${imageId}/comments`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (commentsResponse.ok) {
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData);
                } else {
                    throw new Error('Failed to fetch comments');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchImageAndComments();
    }, [galleryId, imageId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            
            // Ensure username exists before posting a comment
            if (!username) {
                setError('Username is required to post a comment.');
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/galleries/${galleryId}/images/${imageId}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        content: newComment,
                        username: username, // Include username with the comment
                    }),
                }
            );

            if (response.ok) {
                const newCommentData = await response.json();
                setComments((prevComments) => [...prevComments, newCommentData]);
                setNewComment('');
            } else {
                throw new Error('Failed to post comment');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <TemplatePage>
            <div className="view-image-container">
                {loading ? (
                    <p>Loading image...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : image ? (
                    <>
                        <div className="image-section">
                            <div className="image-details">
                                <h3 className="image-title">{image.title || 'Untitled Image'}</h3> {/* Image title displayed above */}
                                <img
                                    src={"http://localhost:5000" + image.url || placeholderImage}
                                    alt={image.title || 'Viewing Image'}
                                    className="view-image"
                                    onError={(e) => (e.target.src = placeholderImage)} // Fallback to placeholder on load error
                                />
                            </div>
                        </div>

                        <div className="comments-section">
                            <h3>Comments</h3>
                            <div className="comment-list">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <Comment 
                                            key={comment.id} 
                                            comment={comment} 
                                            galleryId={galleryId} 
                                            imageId={imageId} 
                                            handleEditComment={(updatedComment) => {
                                                setComments((prevComments) =>
                                                    prevComments.map((c) =>
                                                        c.id === updatedComment.id ? updatedComment : c
                                                    )
                                                );
                                            }}
                                            handleDeleteComment={(deletedCommentId) => {
                                                setComments((prevComments) =>
                                                    prevComments.filter((c) => c.id !== deletedCommentId)
                                                );
                                            }}
                                        />
                                    ))
                                ) : (
                                    <p>No comments yet. Be the first to comment!</p>
                                )}
                            </div>

                            <CommentInput 
                                newComment={newComment} 
                                setNewComment={setNewComment} 
                                handlePostComment={handlePostComment} 
                            />
                        </div>
                    </>
                ) : (
                    <p className="error-message">Image not found</p>
                )}
            </div>
        </TemplatePage>
    );
};

export default ViewImage;
