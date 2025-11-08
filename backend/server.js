// backend/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const clientesRouter = require('./routes/clientes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, msg: 'API Salon OK' }));

// Rutas de Clientes (JOAO)
app.use('/api/clientes', clientesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server escuchando en http://localhost:${PORT}`);
});
