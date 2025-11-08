// backend/db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: false
});

pool.on('error', (err) => {
  console.error('Error en el pool de PostgreSQL:', err);
});

module.exports = pool;
