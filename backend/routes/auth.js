const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Database connection
const { JWT_SECRET, JWT_EXPIRATION } = process.env; // Define JWT secret and expiration in .env

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if the username already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        const result = await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, hashedPassword, role || 'user']
        );

        res.status(201).json(result.rows[0]); // Return the created user (without password)
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Print the received data from the frontend (username and password)
    console.log('Received data:', { username, password });

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if the user exists
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token with necessary payload
        const payload = {
            id: user.id,            // User ID
            username: user.username, // Username
            role: user.role,         // User role (e.g., 'user', 'admin')
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION || '1h' });

        res.json({ token }); // Respond with the generated token
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

