// Script de MongoDB para crear usuarios de prueba
// Ejecutar en MongoDB Compass o mongo shell

// Conectar a la base de datos
use notifications_db;

// Crear usuario administrador
db.users.insertOne({
  name: "Administrador",
  email: "admin@test.com", 
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5GmLdz5.K6", // password123
  role: "admin",
  isActive: true,
  notificationPreferences: {
    email: true,
    push: true,
    inApp: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Crear usuario regular
db.users.insertOne({
  name: "Usuario de Prueba",
  email: "user@test.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5GmLdz5.K6", // password123
  role: "user", 
  isActive: true,
  notificationPreferences: {
    email: true,
    push: true,
    inApp: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Crear notificaciones de prueba
const userId = db.users.findOne({email: "user@test.com"})._id;

db.notifications.insertMany([
  {
    userId: userId,
    title: "¡Bienvenido al sistema!",
    message: "Esta es tu primera notificación. El sistema está funcionando correctamente.",
    type: "success",
    priority: "medium",
    category: "system",
    isRead: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    userId: userId,
    title: "Configuración recomendada",
    message: "Te recomendamos revisar tus preferencias de notificación en el perfil.",
    type: "info",
    priority: "low",
    category: "user",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    userId: userId,
    title: "Mantenimiento programado",
    message: "El sistema tendrá mantenimiento el próximo domingo de 2:00 AM a 4:00 AM.",
    type: "warning",
    priority: "high",
    category: "system",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    userId: userId,
    title: "Notificación leída",
    message: "Esta notificación ya fue leída anteriormente.",
    type: "info",
    priority: "low",
    category: "system",
    isRead: true,
    readAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    userId: userId,
    title: "Error de ejemplo",
    message: "Esta es una notificación de error de ejemplo para probar el sistema.",
    type: "error",
    priority: "high",
    category: "security",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
]);

print("✅ Usuarios y notificaciones de prueba creados exitosamente!");
print("📧 Admin: admin@test.com / password123");  
print("👤 User: user@test.com / password123");
