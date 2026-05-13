const Prediccion = require('../models/Prediccion');
const Partido = require('../models/Partido');
const Fase = require('../models/Fase');
const Usuario = require('../models/Usuario');

// Crear o actualizar predicción
const guardarPrediccion = async (req, res) => {
  try {
    const { partidoId, golesLocalPredicho, golesVisitantePredicho } = req.body;
    const usuarioId = req.usuario.id;

    // Comprobar que el partido existe
    const partido = await Partido.findById(partidoId).populate('fase');
    if (!partido) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    // Comprobar que el partido no ha finalizado
    if (partido.finalizado) {
      return res.status(400).json({ message: 'Este partido ya ha finalizado' });
    }

    // Comprobar fecha límite de la fase
    const ahora = new Date();
    if (ahora > partido.fase.fechaLimite) {
      return res.status(400).json({ message: 'El plazo para predecir esta jornada ha cerrado' });
    }

    // Crear o actualizar predicción (upsert)
    const prediccion = await Prediccion.findOneAndUpdate(
      { usuario: usuarioId, partido: partidoId },
      { golesLocalPredicho, golesVisitantePredicho },
      { upsert: true, new: true }
    );

    res.json({ message: 'Predicción guardada', prediccion });

  } catch (error) {
    res.status(500).json({ message: 'Error guardando predicción', error: error.message });
  }
};

// Obtener predicciones del usuario para una fase
const getMisPredicciones = async (req, res) => {
  try {
    const { faseId } = req.params;
    const usuarioId = req.usuario.id;

    // Buscar todos los partidos de esa fase
    const partidos = await Partido.find({ fase: faseId });
    const partidoIds = partidos.map(p => p._id);

    // Buscar predicciones del usuario para esos partidos
    const predicciones = await Prediccion.find({
      usuario: usuarioId,
      partido: { $in: partidoIds }
    });

    res.json(predicciones);

  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo predicciones', error: error.message });
  }
};

module.exports = { guardarPrediccion, getMisPredicciones };