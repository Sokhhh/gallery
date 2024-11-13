const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorize');
const pool = require('../db');

// Create a new image in a specific gallery
router.post('/:galleryId/images/', authorizeRole('admin'), async (req, res) => {
    const { galleryId } = req.params;
    const { url, title } = req.body;

    // Validation checks
    if (!url || typeof url !== 'string') {
        return res.status(422).json({ error: 'Invalid URL: must be a non-empty string.' });
    }

    if (!title || typeof title !== 'string' || title.length > 255) {
        return res.status(422).json({ error: 'Invalid title: must be a string and less than 255 characters.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO image (gallery_id, url, title) VALUES ($1, $2, $3) RETURNING *',
            [galleryId, url, title]
        );
        res.status(201).json(result.rows[0]); // Respond with 201 Created
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all images for a specific gallery
router.get('/:galleryId/images/', async (req, res) => {
    const { galleryId } = req.params; // Accessing galleryId from the request parameters
    console.log('Fetching images for galleryId:', galleryId); // Log the galleryId
    try {
        const result = await pool.query('SELECT * FROM image WHERE gallery_id = $1', [galleryId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific image
router.get('/:galleryId/images/:imageId', async (req, res) => {
    const { imageId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM image WHERE id = $1', [imageId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific image
router.put('/:galleryId/images/:imageId', authorizeRole('admin'), async (req, res) => {
    const { imageId } = req.params;
    const { url, title } = req.body;
    try {
        const result = await pool.query(
            'UPDATE image SET url = $1, title = $2 WHERE id = $3 RETURNING *',
            [url, title, imageId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific image
router.delete('/:galleryId/images/:imageId', authorizeRole('admin'), async (req, res) => {
    const { imageId } = req.params;
    try {
        const result = await pool.query('DELETE FROM image WHERE id = $1 RETURNING *', [imageId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
