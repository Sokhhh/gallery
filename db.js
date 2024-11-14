const { Pool } = require('pg');

const pool = new Pool({
    user: 'skhadmin', // The username from Azure PostgreSQL
    host: 'skh-gallery-db.postgres.database.azure.com', // The host from Azure PostgreSQL
    database: 'postgres', // The database you created in Azure
    password: 'TEe5fUVQJgrLTXA', // The password for your Azure PostgreSQL user
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // Azure PostgreSQL requires SSL connections
    },
});

module.exports = pool;
