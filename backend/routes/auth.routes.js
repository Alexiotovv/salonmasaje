const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth.controller');
const { validateRegister, validateLogin, handleValidationErrors } = require('../validations/auth.validation');

// Rutas públicas de autenticación
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', logout);

module.exports = router;