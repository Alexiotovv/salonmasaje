const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana por IP
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos'
  }
});

app.use(limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente (sin MongoDB)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Ruta base
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Notificaciones - Sistema BenjaMin_0201 (Demo)',
    version: '1.0.0',
    status: 'MongoDB no conectado - Modo demo',
    endpoints: {
      health: '/health',
      info: 'MongoDB requerido para funcionalidad completa'
    }
  });
});

// Ruta demo de notificaciones
app.get('/api/notifications/demo', (req, res) => {
  res.json({
    success: true,
    message: 'Demo de notificaciones',
    notifications: [
      {
        id: 1,
        title: 'Notificación de demo',
        message: 'Esta es una notificación de demostración',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Servidor funcionando',
        message: 'El servidor Node.js está ejecutándose correctamente',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 60000).toISOString()
      }
    ],
    unreadCount: 2
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
    note: 'Conecta MongoDB para acceder a todas las funcionalidades'
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Servidor DEMO ejecutándose en puerto ${PORT}
📊 Ambiente: ${process.env.NODE_ENV || 'development'}
🌐 URL: http://localhost:${PORT}
📋 Health: http://localhost:${PORT}/health
⚠️  MongoDB no conectado - Usando modo demo
📝 Para funcionalidad completa: instala y ejecuta MongoDB
  `);
});

module.exports = app;
