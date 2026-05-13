const mongoose = require('mongoose');

// Un grupo es simplemente una letra (A, B, C... L)
const grupoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true, // No puede haber dos grupos con la misma letra
    enum: ['A','B','C','D','E','F','G','H','I','J','K','L']
  }
});

module.exports = mongoose.model('Grupo', grupoSchema);