const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const galleriesRoutes = require('./routes/galleries');
const imagesRoutes = require('./routes/images');
const commentsRoutes = require('./routes/comments');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Use the routes
// app.use('/api/galleries', galleriesRoutes);
// app.use('/api/galleries/:galleryId/images', imagesRoutes);
// app.use('/api/galleries/:galleryId/images/:imageId/comments', commentsRoutes);

app.use('/api/galleries/', galleriesRoutes);
app.use('/api/galleries/', imagesRoutes);
app.use('/api/galleries/', commentsRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to create tables if they don't exist
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gallery (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS image (
                id SERIAL PRIMARY KEY,
                gallery_id INTEGER REFERENCES gallery(id) ON DELETE CASCADE,
                url TEXT NOT NULL,
                title VARCHAR(255) NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                image_id INTEGER REFERENCES image(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                author VARCHAR(255) NOT NULL
            );
        `);

        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

//createTables();
