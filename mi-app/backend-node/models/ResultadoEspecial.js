const mongoose = require('mongoose');

const resultadoEspecialSchema = new mongoose.Schema({
  tipo: { type: String, required: true, unique: true },
  tipoValor: { type: String, enum: ['Equipo', 'Jugador'], required: true },
  valorCorrecto: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'tipoValor' }
});

module.exports = mongoose.model('ResultadoEspecial', resultadoEspecialSchema);