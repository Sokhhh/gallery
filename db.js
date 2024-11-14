const { Pool } = require('pg');

const pool = new Pool({
    user: 'user',
    host: 'postgres',
    database: 'db',
    password: 'password',
    port: 5432,
    connectionTimeoutMillis: 5000,
});

const connectToDatabase = async () => {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            await pool.connect();
            console.log('Connected to the database');
            return; // Exit loop if connection is successful
        } catch (error) {
            console.error(`Error connecting to PostgreSQL (attempt ${attempts + 1}):`, error);
            attempts += 1;
            if (attempts < maxAttempts) {
                console.log('Retrying in 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
            } else {
                console.error('Maximum retry attempts reached. Could not connect to the database.');
                process.exit(1); // Exit the application if connection fails after retries
            }
        }
    }
};

connectToDatabase();

module.exports = pool;