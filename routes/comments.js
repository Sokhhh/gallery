const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorize');
const pool = require('../db');

// Create a new comment for a specific image within a specific gallery
router.post('/:galleryId/images/:imageId/comments', authorizeRole('admin'), async (req, res) => {
    const { imageId } = req.params;
    const { content, author } = req.body;

    // Validation checks
    if (!content || typeof content !== 'string') {
        return res.status(422).json({ error: 'Invalid content: must be a non-empty string.' });
    }

    if (!author || typeof author !== 'string' || author.length > 255) {
        return res.status(422).json({ error: 'Invalid author: must be a string and less than 255 characters.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO comments (image_id, content, author) VALUES ($1, $2, $3) RETURNING *',
            [imageId, content, author]
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
        const result = await pool.query('SELECT * FROM comments WHERE image_id = $1', [imageId]);
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
        const result = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific comment
router.put('/:galleryId/images/:imageId/comments/:commentId', authorizeRole('admin'), async (req, res) => {
    const { commentId } = req.params;
    const { content, author } = req.body;
    try {
        const result = await pool.query(
            'UPDATE comments SET content = $1, author = $2 WHERE id = $3 RETURNING *',
            [content, author, commentId]
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

// Delete a specific comment
router.delete('/:galleryId/images/:imageId/comments/:commentId', authorizeRole('admin'), async (req, res) => {
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
