const mongoose = require('mongoose');

// Una fase es cada ronda del mundial
const faseSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    // Todas las fases posibles del mundial
    enum: [
      'Jornada 1 Fase de Grupos',
      'Jornada 2 Fase de Grupos',
      'Jornada 3 Fase de Grupos',
      'Dieciseisavos',
      'Octavos',
      'Cuartos',
      'Semifinales',
      '3er Puesto',
      'Final'
    ]
  },
  fechaLimite: {
    type: Date,
    required: true // Fecha límite para poder predecir esta fase
  }
});

module.exports = mongoose.model('Fase', faseSchema);