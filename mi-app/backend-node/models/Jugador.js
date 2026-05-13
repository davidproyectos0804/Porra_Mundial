const mongoose = require('mongoose');

// Un jugador pertenece a un equipo del mundial
const jugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo', // Referencia al modelo Equipo
    required: true
  },
  posicion: {
    type: String,
    required: true,
    enum: ['Portero', 'Defensa', 'Centrocampista', 'Delantero']
  }
});

module.exports = mongoose.model('Jugador', jugadorSchema);