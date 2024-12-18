const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

require('dotenv').config();
const authenticateJWT = require('./middleware/authenticate');
const authorizeRole = require('./middleware/authorize');

const galleriesRoutes = require('./routes/galleries');
const imagesRoutes = require('./routes/images');
const commentsRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gallery API',
            version: '1.0.0',
            description: 'A simple Express API for managing galleries, images, and comments',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js', './swagger/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes); // Add auth routes for register and login

app.use(authenticateJWT); // Global authentication middleware

app.use('/api/galleries/', galleriesRoutes);
app.use('/api/galleries/', imagesRoutes);
app.use('/api/galleries/', commentsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// User table creation for testing registration
const createUsers = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            );
        `);

        console.log('Users table created successfully');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};

// Create other tables as needed
const createTables = async () => {
    try {
        // Create the 'gallery' table with a 'user_id' column
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gallery (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
            );
        `);

        // Create the 'image' table with a 'user_id' column
        await pool.query(`
            CREATE TABLE IF NOT EXISTS image (
                id SERIAL PRIMARY KEY,
                gallery_id INTEGER REFERENCES gallery(id) ON DELETE CASCADE,
                url TEXT NOT NULL,
                title VARCHAR(255) NOT NULL
            );
        `);

        // Create the 'comments' table with a 'user_id' column
        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                image_id INTEGER REFERENCES image(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
            );
        `);

        console.log('Tables with user_id created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

const clearDatabase = async () => {
    try {
        // Drop the tables in reverse order of creation to avoid foreign key conflicts
        await pool.query(`DROP TABLE IF EXISTS comments CASCADE;`);
        await pool.query(`DROP TABLE IF EXISTS image CASCADE;`);
        await pool.query(`DROP TABLE IF EXISTS gallery CASCADE;`);
        await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);

        console.log('All tables dropped successfully');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

const resetDatabase = async () => {
    await clearDatabase();  // Drop existing tables
    await createUsers();    // Recreate the users table
    await createTables();   // Recreate other tables
};

// Uncomment the line below to run the reset process
// resetDatabase();

