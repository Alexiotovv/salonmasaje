const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviciosController');

// Rutas CRUD para Servicios
router.get('/', controller.obtenerServicios);            // Obtener todos los servicios
router.get('/:id', controller.obtenerServicioPorId);     // Obtener un servicio por ID
router.post('/', controller.crearServicio);              // Crear nuevo servicio
router.put('/:id', controller.actualizarServicio);       // Actualizar servicio existente
router.delete('/:id', controller.eliminarServicio);      // Eliminar servicio

module.exports = router;
