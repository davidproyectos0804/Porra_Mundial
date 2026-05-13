const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// REGISTRO
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Comprobar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada
    });

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
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
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
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

module.exports = { register, login };