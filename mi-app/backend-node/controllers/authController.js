const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTRO
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada,
      verificado: true,
      tokenVerificacion: null
    });

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
        puntosTotales: usuario.puntosTotales,
        fotoPerfil: usuario.fotoPerfil
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

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

    if (!usuario.password) {
      return res.status(400).json({ message: 'Esta cuenta usa Google para iniciar sesión' });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }

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
        puntosTotales: usuario.puntosTotales,
        fotoPerfil: usuario.fotoPerfil
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Token de Google requerido' });
    }

    // Verificar el token con Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Buscar o crear usuario
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      usuario = await Usuario.create({
        nombre: name,
        email,
        password: null,
        verificado: true,
        fotoPerfil: picture || null,
        googleId
      });
      } else {
        // FIX: actualizar foto y googleId si no los tenía
        if (!usuario.fotoPerfil && picture) {
          usuario.fotoPerfil = picture;
        }
        if (!usuario.googleId) {
          usuario.googleId = googleId;
        }
        await usuario.save();
      }

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
        puntosTotales: usuario.puntosTotales,
        fotoPerfil: usuario.fotoPerfil
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error verificando token de Google', error: error.message });
  }
};

module.exports = { register, login, googleLogin };