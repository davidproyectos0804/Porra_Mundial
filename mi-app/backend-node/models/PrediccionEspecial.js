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
      'Goleador',
      'Seleccion decepcion',
      'MVP del mundial'
    ]
  },
  // Lo que predice el usuario
  // Puede ser un equipo o un jugador según el tipo
  valorPredicho: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tipoValor', // Referencia dinámica
    required: true
  },
  tipoValor: {
    type: String,
    required: true,
    enum: ['Equipo', 'Jugador'] // Ganador/Subcampeon/Decepcion = Equipo, Goleador/MVP = Jugador
  },
  puntosObtenidos: {
    type: Number,
    default: null // null hasta que se resuelva al final del mundial
  }
}, { timestamps: true });

// Un usuario solo puede hacer cada tipo de predicción una vez
prediccionEspecialSchema.index({ usuario: 1, tipo: 1 }, { unique: true });

module.exports = mongoose.model('PrediccionEspecial', prediccionEspecialSchema);