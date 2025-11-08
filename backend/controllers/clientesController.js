// backend/controllers/clientesController.js
const { validationResult } = require('express-validator');
const pool = require('../db/pool');

// helper para manejar validaciones
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
}

exports.crearCliente = async (req, res) => {
  const v = handleValidation(req, res); if (v) return;
  const { nombre, telefono } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO clientes (nombre, telefono) VALUES ($1, $2) RETURNING *`,
      [nombre, telefono]
    );
    return res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error creando cliente' });
  }
};

exports.listarClientes = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM clientes ORDER BY id DESC`
    );
    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error listando clientes' });
  }
};

exports.obtenerCliente = async (req, res) => {
  const v = handleValidation(req, res); if (v) return;
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM clientes WHERE id = $1`,
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ ok: false, msg: 'Cliente no encontrado' });
    }
    return res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error obteniendo cliente' });
  }
};

exports.actualizarCliente = async (req, res) => {
  const v = handleValidation(req, res); if (v) return;
  const { id } = req.params;
  const { nombre, telefono } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE clientes
       SET nombre = COALESCE($1, nombre),
           telefono = COALESCE($2, telefono)
       WHERE id = $3
       RETURNING *`,
      [nombre || null, telefono || null, id]
    );
    if (!rows.length) {
      return res.status(404).json({ ok: false, msg: 'Cliente no encontrado' });
    }
    return res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error actualizando cliente' });
  }
};

exports.eliminarCliente = async (req, res) => {
  const v = handleValidation(req, res); if (v) return;
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM clientes WHERE id = $1`,
      [id]
    );
    if (!rowCount) {
      return res.status(404).json({ ok: false, msg: 'Cliente no encontrado' });
    }
    return res.json({ ok: true, msg: 'Cliente eliminado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error eliminando cliente' });
  }
};

exports.historialTurnosPorCliente = async (req, res) => {
  const v = handleValidation(req, res); if (v) return;
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT t.id, t.fecha, t.estado, s.nombre AS servicio
       FROM turnos t
       LEFT JOIN servicios s ON s.id = t.servicio_id
       WHERE t.cliente_id = $1
       ORDER BY t.fecha DESC`,
      [id]
    );
    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error listando turnos' });
  }
};

exports.historialServiciosPorCliente = async (req, res) => {
  const v = handleValidation(req, res); if (v) return;
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT s.id AS servicio_id, s.nombre, s.descripcion, s.duracion_min, s.precio,
              t.id AS turno_id, t.fecha
       FROM turnos t
       JOIN servicios s ON s.id = t.servicio_id
       WHERE t.cliente_id = $1 AND t.estado = 'completado'
       ORDER BY t.fecha DESC`,
      [id]
    );
    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, msg: 'Error listando servicios recibidos' });
  }
};
