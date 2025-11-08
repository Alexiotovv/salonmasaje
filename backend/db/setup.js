// backend/db/setup.js
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

(async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Esquema aplicado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error aplicando esquema:', err);
    process.exit(1);
  }
})();
