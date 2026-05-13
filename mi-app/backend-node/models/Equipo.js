const mongoose = require('mongoose');

// Un equipo es una selección del mundial
const equipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true // No puede haber dos equipos iguales
  },
  grupo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupo', // Referencia al modelo Grupo
    required: true
  },
  bandera: {
    type: String // URL de la imagen de la bandera
  }
});

module.exports = mongoose.model('Equipo', equipoSchema);