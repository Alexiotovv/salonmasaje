# Sistema de Notificaciones - BenjaMin_0201

Sistema completo de notificaciones internas con frontend y backend desarrollado con Node.js, Express, React y MongoDB.

## 🚀 Características

### Backend
- **API RESTful** con Express.js
- **Base de datos** MongoDB con Mongoose
- **Autenticación** JWT con middleware de protección
- **Validaciones** completas de datos
- **Manejo de errores** centralizado
- **Rate limiting** para protección contra ataques
- **Logs** con Morgan
- **Seguridad** con Helmet

### Frontend
- **React 18** con Hooks modernos
- **Componente de campana** interactivo
- **Context API** para manejo de estado
- **Routing** con React Router
- **Notificaciones toast** con React Hot Toast
- **Diseño responsive** y accesible
- **Filtros y búsqueda** de notificaciones

### Funcionalidades del Sistema
- ✅ Crear notificaciones individuales y masivas
- ✅ Marcar como leída/no leída
- ✅ Filtrar por tipo, categoría y estado
- ✅ Eliminar notificaciones individuales o todas las leídas
- ✅ Dashboard con estadísticas completas
- ✅ Sistema de prioridades (alta, media, baja)
- ✅ Categorías (sistema, usuario, admin, seguridad)
- ✅ Tipos (info, éxito, advertencia, error)
- ✅ URLs de acción opcionales
- ✅ Expiración automática de notificaciones
- ✅ Actualización en tiempo real

## 📋 Requisitos Previos

- Node.js 16+ 
- MongoDB 4.4+
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
\`\`\`bash
git clone <url-del-repositorio>
cd proyecto
\`\`\`

### 2. Instalar dependencias del backend
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Instalar dependencias del frontend
\`\`\`bash
cd ../frontend
npm install
\`\`\`

### 4. Configurar variables de entorno

Crear archivo \`.env\` en la carpeta \`backend\`:

\`\`\`env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notifications_db
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_2024
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
\`\`\`

### 5. Iniciar MongoDB

Asegúrate de tener MongoDB ejecutándose:

\`\`\`bash
# Si usas MongoDB Community Edition
mongod

# Si usas MongoDB con systemctl (Linux)
sudo systemctl start mongod

# Si usas Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
\`\`\`

## 🚀 Ejecutar el proyecto

### Desarrollo

#### Terminal 1 - Backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

#### Terminal 2 - Frontend
\`\`\`bash
cd frontend
npm start
\`\`\`

El backend estará disponible en \`http://localhost:3000\`
El frontend estará disponible en \`http://localhost:3001\`

### Producción

#### Backend
\`\`\`bash
cd backend
npm start
\`\`\`

#### Frontend
\`\`\`bash
cd frontend
npm run build
# Servir los archivos estáticos con un servidor web
\`\`\`

## 📚 API Endpoints

### Autenticación
- \`POST /api/auth/register\` - Registrar usuario
- \`POST /api/auth/login\` - Iniciar sesión
- \`GET /api/auth/profile\` - Obtener perfil (protegido)
- \`PUT /api/auth/profile\` - Actualizar perfil (protegido)

### Notificaciones
- \`GET /api/notifications\` - Listar notificaciones del usuario
- \`GET /api/notifications/stats\` - Estadísticas de notificaciones
- \`GET /api/notifications/:id\` - Obtener notificación específica
- \`PATCH /api/notifications/:id/read\` - Marcar como leída
- \`PATCH /api/notifications/read-all\` - Marcar todas como leídas
- \`DELETE /api/notifications/:id\` - Eliminar notificación
- \`DELETE /api/notifications/read/all\` - Eliminar todas las leídas
- \`POST /api/notifications\` - Crear notificación (admin)
- \`POST /api/notifications/bulk\` - Crear notificaciones masivas (admin)

### Parámetros de consulta disponibles:
- \`page\` - Número de página (default: 1)
- \`limit\` - Límite por página (default: 20)
- \`type\` - Filtrar por tipo (info|success|warning|error)
- \`isRead\` - Filtrar por estado (true|false)
- \`category\` - Filtrar por categoría (system|user|admin|security)
- \`priority\` - Filtrar por prioridad (low|medium|high)

## 🏗️ Estructura del Proyecto

\`\`\`
proyecto/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notifications.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── NotificationBell.js
    │   │   └── NotificationBell.css
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── README.md
\`\`\`

## 🎨 Componentes Principales

### NotificationBell
Componente principal que muestra:
- Icono de campana con contador de notificaciones no leídas
- Panel desplegable con lista de notificaciones
- Filtros por tipo y estado
- Acciones para marcar como leída y eliminar
- Actualización automática cada 30 segundos

### Dashboard
Panel de control que muestra:
- Estadísticas generales de notificaciones
- Desglose por tipo y categoría
- Lista de notificaciones recientes
- Gráficos de progreso

## 🔧 Configuración Avanzada

### Base de Datos
El sistema incluye índices optimizados para mejorar el rendimiento:
- Índice compuesto en \`userId\` y \`createdAt\`
- Índice compuesto en \`userId\` y \`isRead\`
- Índice TTL para expiración automática

### Seguridad
- Autenticación JWT con expiración configurable
- Rate limiting (100 requests por 15 minutos por IP)
- Validación de entrada en todos los endpoints
- Headers de seguridad con Helmet
- Hash de contraseñas con bcryptjs

### Performance
- Paginación en listados de notificaciones
- Consultas optimizadas con lean()
- Agregaciones para estadísticas
- Lazy loading de componentes

## 🧪 Testing

### Crear usuario administrador (para testing)
\`\`\`javascript
// Ejecutar en MongoDB shell o Compass
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
);
\`\`\`

### Crear notificaciones de prueba
\`\`\`bash
# Hacer POST a /api/notifications con token de admin
curl -X POST http://localhost:3000/api/notifications \\
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "USER_ID_HERE",
    "title": "Notificación de prueba",
    "message": "Este es un mensaje de prueba",
    "type": "info",
    "priority": "medium",
    "category": "system"
  }'
\`\`\`

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
\`\`\`bash
# Verificar que MongoDB esté ejecutándose
sudo systemctl status mongod

# Ver logs de MongoDB
sudo journalctl -u mongod
\`\`\`

### Error de CORS
Verificar que la variable \`FRONTEND_URL\` en el \`.env\` del backend apunte correctamente al frontend.

### Error de autenticación
Verificar que el \`JWT_SECRET\` esté configurado correctamente en el archivo \`.env\`.

## 📝 Notas de Desarrollo

### Próximas funcionalidades
- [ ] Notificaciones push en tiempo real con WebSockets
- [ ] Plantillas de notificaciones
- [ ] Notificaciones por email
- [ ] API de webhooks
- [ ] Panel de administración completo
- [ ] Exportación de datos
- [ ] Roles y permisos granulares

### Arquitectura
El sistema sigue una arquitectura MVC con separación clara de responsabilidades:
- **Modelos**: Mongoose schemas con validaciones
- **Controladores**: Lógica de negocio y manejo de requests
- **Rutas**: Definición de endpoints y middlewares
- **Servicios**: Comunicación con APIs (frontend)
- **Contexto**: Manejo de estado global (React)

## 👤 Autor

**BenjaMin_0201**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.
