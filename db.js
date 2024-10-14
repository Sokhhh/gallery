const { Pool } = require('pg');

const pool = new Pool({
    user: 'user',
    host: 'localhost', // Change this if running in Docker
    database: 'db',
    password: 'password',
    port: 5432,
});

module.exports = pool;
