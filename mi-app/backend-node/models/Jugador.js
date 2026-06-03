const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  posicion: {
    type: String,
    enum: ['Portero', 'Defensa', 'Centrocampista', 'Delantero'],
    default: null
  },
  fechaNacimiento: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Jugador', jugadorSchema);