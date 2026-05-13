const Partido = require('../models/Partido');
const Equipo = require('../models/Equipo');
const Fase = require('../models/Fase');

// Obtener partidos por fase
const getPartidosPorFase = async (req, res) => {
  try {
    const { faseId } = req.params;

    const partidos = await Partido.find({ fase: faseId })
      .populate('equipoLocal', 'nombre bandera')
      .populate('equipoVisitante', 'nombre bandera')
      .populate('fase', 'nombre fechaLimite')
      .sort({ fechaHora: 1 });

    res.json(partidos);

  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo partidos', error: error.message });
  }
};

// Obtener todas las fases
const getFases = async (req, res) => {
  try {
    const fases = await Fase.find().sort({ fechaLimite: 1 });
    res.json(fases);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo fases', error: error.message });
  }
};

module.exports = { getPartidosPorFase, getFases };