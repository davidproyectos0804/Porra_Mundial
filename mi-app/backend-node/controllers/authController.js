const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const { enviarEmailVerificacion } = require('../services/emailService');

// REGISTRO
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Comprobar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Generar token de verificación
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');

    // Crear usuario sin verificar
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada,
      tokenVerificacion,
      verificado: false
    });

    // Enviar email de verificación
    await enviarEmailVerificacion(email, nombre, tokenVerificacion);

    res.status(201).json({
      message: 'Registro exitoso. Revisa tu email para verificar tu cuenta.'
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// VERIFICAR EMAIL
const verificarEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const usuario = await Usuario.findOne({ tokenVerificacion: token });
    if (!usuario) {
      return res.status(400).json({ message: 'Token de verificación inválido' });
    }

    usuario.verificado = true;
    usuario.tokenVerificacion = null;
    await usuario.save();

    res.json({ message: 'Cuenta verificada correctamente. Ya puedes iniciar sesión.' });

  } catch (error) {
    res.status(500).json({ message: 'Error verificando cuenta', error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Comprobar si está verificado
    if (!usuario.verificado) {
      return res.status(400).json({ message: 'Debes verificar tu email antes de iniciar sesión' });
    }

    // Comprobar contraseña
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        puntosTotales: usuario.puntosTotales
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

module.exports = { register, login, verificarEmail };