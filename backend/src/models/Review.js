// src/models/Review.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  masajistaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  servicioId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 500]
    }
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true, // createdAt, updatedAt
  tableName: 'reviews'
});

export default Review;