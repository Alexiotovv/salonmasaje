
const { Sequelize } = require('sequelize');

require('dotenv').config();

// Configuración de la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME || 'salon_masaje',
  process.env.DB_USER || 'root',       
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, 
    define: {
      timestamps: true,
    },
  }
);

// Probar la conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a MySQL establecida correctamente.');
  })
  .catch((error) => {
    console.error('Error al conectar con MySQL:', error);
  });

module.exports = sequelize;