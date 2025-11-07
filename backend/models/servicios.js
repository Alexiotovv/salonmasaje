const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Servicio = sequelize.define('Servicio', {
    id_servicio: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nombre_servicio: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    duracion_minutos: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    precio: { 
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false 
    },
    descripcion: { 
        type: DataTypes.TEXT, 
        allowNull: true 
    },
    estado: { 
        type: DataTypes.TINYINT, 
        allowNull: false, 
        defaultValue: 1 
    },
}, {
    tableName: 'servicios',
    timestamps: false
});

module.exports = Servicio;
