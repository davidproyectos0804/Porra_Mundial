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
    required: true
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
    default: false // Por defecto no verificado
  },
  tokenVerificacion: {
    type: String,
    default: null // Token que se envía por email
  },
  fotoPerfil: {
    type: String,
    default: null
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);