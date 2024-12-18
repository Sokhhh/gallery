const express = require('express');
const router = express.Router();
const pool = require('../db');

// Middleware to check if the user is the gallery owner or an admin
const checkGalleryOwnershipOrAdmin = async (req, res, next) => {
    const { galleryId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const gallery = await pool.query('SELECT * FROM gallery WHERE id = $1', [galleryId]);
        if (gallery.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery not found' });
        }

        const galleryOwnerId = gallery.rows[0].user_id;

        // Allow if the user is the owner or an admin
        if (userId !== galleryOwnerId && userRole !== 'admin') {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Proceed to the next middleware/handler
        next();
    } catch (error) {
        console.error('Error checking gallery ownership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new image in a specific gallery
router.post('/:galleryId/images/', checkGalleryOwnershipOrAdmin, async (req, res) => {
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

// Get all images for a specific gallery (accessible to all users)
router.get('/:galleryId/images/', async (req, res) => {
    const { galleryId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM image WHERE gallery_id = $1', [galleryId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific image (accessible to all users)
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

// Update a specific image (only the gallery owner or admin can update)
router.put('/:galleryId/images/:imageId', checkGalleryOwnershipOrAdmin, async (req, res) => {
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

// Delete a specific image (only the gallery owner or admin can delete)
router.delete('/:galleryId/images/:imageId', checkGalleryOwnershipOrAdmin, async (req, res) => {
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
