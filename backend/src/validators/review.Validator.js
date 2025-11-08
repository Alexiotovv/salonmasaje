// src/validators/reviewValidator.js
import { body } from 'express-validator';

export const createReviewValidation = [
  body('userId')
    .isInt({ min: 1 }).withMessage('ID de cliente inválido'),
  body('masajistaId')
    .isInt({ min: 1 }).withMessage('ID de masajista inválido'),
  body('calificacion')
    .isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser entre 1 y 5'),
  body('comentario')
    .isLength({ min: 10, max: 500 }).withMessage('El comentario debe tener entre 10 y 500 caracteres')
];