const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorize');
const pool = require('../db');

// Create a new gallery
router.post('/', authorizeRole('admin'), async (req, res) => {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.length > 255) {
        return res.status(422).json({ error: 'Invalid name: must be a string and less than 255 characters.' });
    }

    if (!description || typeof description !== 'string') {
        return res.status(422).json({ error: 'Invalid description: must be a non-empty string.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO gallery (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating gallery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all galleries
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gallery');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching galleries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific gallery
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

// Update a specific gallery (requires admin)
router.put('/:galleryId', authorizeRole('admin'), async (req, res) => {
    const { galleryId } = req.params;
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE gallery SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, galleryId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating gallery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific gallery (requires admin)
router.delete('/:galleryId', authorizeRole('admin'), async (req, res) => {
    const { galleryId } = req.params;
    try {
        const result = await pool.query('DELETE FROM gallery WHERE id = $1 RETURNING *', [galleryId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery not found' });
        }
        res.json({ message: 'Gallery deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;