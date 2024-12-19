const express = require('express');
const router = express.Router();
const pool = require('../db');

// Middleware to check if the user is the comment creator or an admin
const checkCommentOwnershipOrAdmin = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log('Checking ownership for comment:', commentId);
    console.log('Authenticated user ID:', userId);
    console.log('Authenticated user role:', userRole);

    try {
        const comment = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
        if (comment.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const commentUserId = comment.rows[0].user_id;

        // Debugging: Check the values being compared
        console.log('Comment user ID:', commentUserId);

        // Allow if the user is the comment creator or an admin
        if (userId !== commentUserId && userRole !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Proceed to the next middleware/handler
        next();
    } catch (error) {
        console.error('Error checking comment ownership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new comment for a specific image within a specific gallery
router.post('/:galleryId/images/:imageId/comments', async (req, res) => {
    const { imageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Get the userId from the authenticated user

    // Validation checks
    if (!content || typeof content !== 'string') {
        return res.status(422).json({ error: 'Invalid content: must be a non-empty string.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO comments (image_id, content, user_id) VALUES ($1, $2, $3) RETURNING *',
            [imageId, content, userId]
        );
        res.status(201).json(result.rows[0]); // Respond with 201 Created
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all comments for a specific image within a specific gallery
router.get('/:galleryId/images/:imageId/comments/', async (req, res) => {
    const { imageId } = req.params;
    try {
        const result = await pool.query(`
            SELECT comments.*, users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.image_id = $1
        `, [imageId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific comment
router.get('/:galleryId/images/:imageId/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    try {
        const result = await pool.query(`
            SELECT comments.*, users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            WHERE comments.id = $1
        `, [commentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific comment (only the comment creator or admin can update)
router.put('/:galleryId/images/:imageId/comments/:commentId', checkCommentOwnershipOrAdmin, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const result = await pool.query(
            'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
            [content, commentId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific comment (only the comment creator or admin can delete)
router.delete('/:galleryId/images/:imageId/comments/:commentId', checkCommentOwnershipOrAdmin, async (req, res) => {
    const { commentId } = req.params;

    try {
        const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [commentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
