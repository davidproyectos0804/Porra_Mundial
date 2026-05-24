const mongoose = require('mongoose');

const prediccionEspecialSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: [
    'Ganador del mundial',
    'Subcampeon',
    'Seleccion decepcion',
    'Mejor anfitrion',
    'Equipo mas goleador',
    'Equipo menos goleado',
    'Equipo sorpresa',
    'Goleador',
    'MVP del mundial',
    'Mejor portero',
    'Maximo asistente',
    'Mejor jugador joven'
  ]
  },
  valorPredicho: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tipoValor',
    required: true
  },
  tipoValor: {
    type: String,
    required: true,
    enum: ['Equipo', 'Jugador']
  },
  puntosObtenidos: {
    type: Number,
    default: null
  }
}, { timestamps: true });

prediccionEspecialSchema.index({ usuario: 1, tipo: 1 }, { unique: true });

module.exports = mongoose.model('PrediccionEspecial', prediccionEspecialSchema);