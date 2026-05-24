const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null  // ← no required, puede ser null para usuarios de Google
  },
  rol: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  puntosTotales: {
    type: Number,
    default: 0
  },
  verificado: {
    type: Boolean,
    default: true
  },
  tokenVerificacion: {
    type: String,
    default: null
  },
  fotoPerfil: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    default: null  // ← nuevo campo
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);