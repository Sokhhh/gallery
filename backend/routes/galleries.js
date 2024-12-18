const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorize');
const pool = require('../db');

// Create a new gallery (admin or authenticated user)
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id; // Assuming `authenticateJWT` middleware adds `req.user`

    if (!name || typeof name !== 'string' || name.length > 255) {
        return res.status(422).json({ error: 'Invalid name: must be a string and less than 255 characters.' });
    }

    if (!description || typeof description !== 'string') {
        return res.status(422).json({ error: 'Invalid description: must be a non-empty string.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO gallery (name, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating gallery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all galleries (accessible to all users)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gallery');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching galleries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific gallery (accessible to all users)
router.get('/:galleryId', async (req, res) => {
    const { galleryId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM gallery WHERE id = $1', [galleryId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific gallery (only admin or creator can update)
router.put('/:galleryId', async (req, res) => {
    const { galleryId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // Check if the gallery exists and get the user_id
        const gallery = await pool.query('SELECT * FROM gallery WHERE id = $1', [galleryId]);
        if (gallery.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        const galleryOwnerId = gallery.rows[0].user_id;

        // Only the owner or admin can update
        if (userId !== galleryOwnerId && userRole !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Perform the update
        const result = await pool.query(
            'UPDATE gallery SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, galleryId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating gallery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific gallery (only admin or creator can delete)
router.delete('/:galleryId', async (req, res) => {
    const { galleryId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // Check if the gallery exists and get the user_id
        const gallery = await pool.query('SELECT * FROM gallery WHERE id = $1', [galleryId]);
        if (gallery.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        const galleryOwnerId = gallery.rows[0].user_id;

        // Only the owner or admin can delete
        if (userId !== galleryOwnerId && userRole !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Perform the deletion
        await pool.query('DELETE FROM gallery WHERE id = $1', [galleryId]);
        res.json({ message: 'Gallery deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
