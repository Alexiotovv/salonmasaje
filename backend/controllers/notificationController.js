const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');

// Crear notificación
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, priority, category, actionUrl } = req.body;
    
    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const notification = new Notification({
      userId,
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      category: category || 'system',
      actionUrl
    });
    
    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Notificación creada exitosamente',
      notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la notificación',
      error: error.message
    });
  }
};

// Crear notificación masiva
exports.createBulkNotification = async (req, res) => {
  try {
    const { userIds, title, message, type, priority, category, actionUrl } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de IDs de usuarios'
      });
    }
    
    const notifications = userIds.map(userId => ({
      userId,
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      category: category || 'system',
      actionUrl
    }));
    
    const result = await Notification.insertMany(notifications);
    
    res.status(201).json({
      success: true,
      message: `${result.length} notificaciones creadas exitosamente`,
      count: result.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear notificaciones masivas',
      error: error.message
    });
  }
};

// Obtener notificaciones del usuario
exports.getUserNotifications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      isRead, 
      category,
      priority 
    } = req.query;
    
    const userId = req.user.id;
    
    // Construir filtros dinámicos
    const filters = { userId };
    if (type) filters.type = type;
    if (isRead !== undefined) filters.isRead = isRead === 'true';
    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filters)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Notification.countDocuments(filters),
      Notification.countDocuments({ userId, isRead: false })
    ]);
    
    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotifications: total,
        limit: parseInt(limit)
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones',
      error: error.message
    });
  }
};

// Obtener una notificación específica
exports.getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({ _id: id, userId });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }
    
    res.json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la notificación',
      error: error.message
    });
  }
};

// Marcar notificación como leída
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Notificación marcada como leída',
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al marcar como leída',
      error: error.message
    });
  }
};

// Marcar todas como leídas
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, type } = req.query;
    
    const filters = { userId, isRead: false };
    if (category) filters.category = category;
    if (type) filters.type = type;
    
    const result = await Notification.updateMany(
      filters,
      { 
        isRead: true,
        readAt: new Date()
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} notificaciones marcadas como leídas`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al marcar todas como leídas',
      error: error.message
    });
  }
};

// Eliminar notificación
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Notificación eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la notificación',
      error: error.message
    });
  }
};

// Eliminar todas las notificaciones leídas
exports.deleteAllRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Notification.deleteMany({ 
      userId, 
      isRead: true 
    });
    
    res.json({
      success: true,
      message: `${result.deletedCount} notificaciones eliminadas`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar notificaciones',
      error: error.message
    });
  }
};

// Obtener estadísticas de notificaciones
exports.getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Notification.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { 
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } 
          },
          byType: {
            $push: {
              type: '$type',
              isRead: '$isRead'
            }
          },
          byCategory: {
            $push: {
              category: '$category',
              isRead: '$isRead'
            }
          }
        }
      }
    ]);
    
    const result = stats[0] || { total: 0, unread: 0, byType: [], byCategory: [] };
    
    // Procesar estadísticas por tipo
    const typeStats = {};
    const categoryStats = {};
    
    result.byType.forEach(item => {
      if (!typeStats[item.type]) {
        typeStats[item.type] = { total: 0, unread: 0 };
      }
      typeStats[item.type].total++;
      if (!item.isRead) typeStats[item.type].unread++;
    });
    
    result.byCategory.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { total: 0, unread: 0 };
      }
      categoryStats[item.category].total++;
      if (!item.isRead) categoryStats[item.category].unread++;
    });
    
    res.json({
      success: true,
      stats: {
        total: result.total,
        unread: result.unread,
        read: result.total - result.unread,
        byType: typeStats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
