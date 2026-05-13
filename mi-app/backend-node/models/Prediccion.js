const mongoose = require('mongoose');

const prediccionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  partido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partido',
    required: true
  },
  golesLocalPredicho: {
    type: Number,
    required: true
  },
  golesVisitantePredicho: {
    type: Number,
    required: true
  },
  puntosObtenidos: {
    type: Number,
    default: null // null hasta que el partido finalice y se calcule
  }
}, {
  // No puede haber dos predicciones del mismo usuario para el mismo partido
  timestamps: true
});

// Índice único: un usuario solo puede predecir un partido una vez
prediccionSchema.index({ usuario: 1, partido: 1 }, { unique: true });

module.exports = mongoose.model('Prediccion', prediccionSchema);