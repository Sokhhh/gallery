const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new gallery
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO gallery (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.json(result.rows[0]);
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

// Update a specific gallery
router.put('/:galleryId', async (req, res) => {
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

// Delete a specific gallery
router.delete('/:galleryId', async (req, res) => {
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
