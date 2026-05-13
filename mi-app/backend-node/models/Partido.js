const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema({
  fase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fase',
    required: true
  },
  equipoLocal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  equipoVisitante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  fechaHora: {
    type: Date,
    required: true // Fecha y hora real del partido
  },
  // Resultado real, lo rellena el admin cuando acaba el partido
  golesLocal: {
    type: Number,
    default: null
  },
  golesVisitante: {
    type: Number,
    default: null
  },
  finalizado: {
    type: Boolean,
    default: false // El admin lo pone a true cuando mete el resultado
  }
});

module.exports = mongoose.model('Partido', partidoSchema);