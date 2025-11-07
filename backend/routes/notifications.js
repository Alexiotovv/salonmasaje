const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para usuarios regulares
router.get('/', notificationController.getUserNotifications);
router.get('/stats', notificationController.getNotificationStats);
router.get('/:id', notificationController.getNotification);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/read/all', notificationController.deleteAllRead);

// Rutas para administradores
router.post('/', authorize('admin'), notificationController.createNotification);
router.post('/bulk', authorize('admin'), notificationController.createBulkNotification);

module.exports = router;
