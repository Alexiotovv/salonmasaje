const { body, validationResult } = require('express-validator');

// Middleware de validación para registro
exports.validateRegister = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Formato de correo inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('phone')
    .optional()
    .isLength({ max: 20 }).withMessage('El teléfono es demasiado largo'),

  body('role')
    .optional()
    .isIn(['cliente', 'masajista', 'administrador']).withMessage('Rol inválido'),
];

// Middleware de validación para login
exports.validateLogin = [
  body('email')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Formato de correo inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

// Middleware para verificar errores de validación
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: errors.array({ onlyFirstError: true }),
    });
  }
  next();
};