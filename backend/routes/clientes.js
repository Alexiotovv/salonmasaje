// backend/routes/clientes.js
const express = require('express');
const { body, param } = require('express-validator');
const {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente,
  historialTurnosPorCliente,
  historialServiciosPorCliente
} = require('../controllers/clientesController');

const router = express.Router();

/**
 * POST /api/clientes
 * body: { nombre, telefono }
 */
router.post(
  '/',
  [
    body('nombre').trim().notEmpty().withMessage('nombre es requerido'),
    body('telefono').trim().notEmpty().withMessage('telefono es requerido')
  ],
  crearCliente
);

/**
 * GET /api/clientes
 */
router.get('/', listarClientes);

/**
 * GET /api/clientes/:id
 */
router.get(
  '/:id',
  [param('id').isInt().toInt()],
  obtenerCliente
);

/**
 * PUT /api/clientes/:id
 * body: { nombre?, telefono? }
 */
router.put(
  '/:id',
  [
    param('id').isInt().toInt(),
    body('nombre').optional().trim().notEmpty(),
    body('telefono').optional().trim().notEmpty()
  ],
  actualizarCliente
);

/**
 * DELETE /api/clientes/:id
 */
router.delete(
  '/:id',
  [param('id').isInt().toInt()],
  eliminarCliente
);

/**
 * GET /api/clientes/:id/turnos
 * Historial de turnos del cliente
 */
router.get(
  '/:id/turnos',
  [param('id').isInt().toInt()],
  historialTurnosPorCliente
);

/**
 * GET /api/clientes/:id/servicios
 * Historial de servicios recibidos (turnos completados)
 */
router.get(
  '/:id/servicios',
  [param('id').isInt().toInt()],
  historialServiciosPorCliente
);

module.exports = router;
