const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utilidad para generar JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// REGISTRO DE USUARIO
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'cliente' } = req.body;

    // Validar que el email no esté registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role, 
    });

    // Generar token (opcional al registrarse, pero útil para auto-login)
    const token = generateToken(newUser.id, newUser.role);

    // No devolver la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

// LOGIN DE USUARIO
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está activo
    if (!user.status) {
      return res.status(403).json({ message: 'Usuario inactivo. Contacte al administrador.' });
    }

    // Generar token
    const token = generateToken(user.id, user.role);

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Sesión cerrada' });
};