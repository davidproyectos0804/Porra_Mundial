const Partido = require('../models/Partido');
const Prediccion = require('../models/Prediccion');
const Usuario = require('../models/Usuario');
const Fase = require('../models/Fase');
const Equipo = require('../models/Equipo');

// Calcular puntos de una predicción
const calcularPuntos = (prediccion, golesLocalReal, golesVisitanteReal) => {
  const { golesLocalPredicho, golesVisitantePredicho } = prediccion;

  // Resultado exacto
  if (golesLocalPredicho === golesLocalReal && golesVisitantePredicho === golesVisitanteReal) {
    return 500;
  }

  // Determinar ganador real
  const ganadorReal = golesLocalReal > golesVisitanteReal ? 'local'
    : golesLocalReal < golesVisitanteReal ? 'visitante' : 'empate';

  // Determinar ganador predicho
  const ganadorPredicho = golesLocalPredicho > golesVisitantePredicho ? 'local'
    : golesLocalPredicho < golesVisitantePredicho ? 'visitante' : 'empate';

  // Acertó el ganador o empate
  if (ganadorReal === ganadorPredicho) {
    return 200;
  }

  return 0;
};

// Meter resultado de un partido
const meterResultado = async (req, res) => {
  try {
    const { partidoId } = req.params;
    const { golesLocal, golesVisitante } = req.body;

    // Buscar el partido
    const partido = await Partido.findById(partidoId);
    if (!partido) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    if (partido.finalizado) {
      return res.status(400).json({ message: 'Este partido ya tiene resultado' });
    }

    // Actualizar resultado del partido
    partido.golesLocal = golesLocal;
    partido.golesVisitante = golesVisitante;
    partido.finalizado = true;
    await partido.save();

    // Buscar todas las predicciones de este partido
    const predicciones = await Prediccion.find({ partido: partidoId });

    // Calcular y guardar puntos de cada predicción
    for (const prediccion of predicciones) {
      const puntos = calcularPuntos(prediccion, golesLocal, golesVisitante);
      prediccion.puntosObtenidos = puntos;
      await prediccion.save();

      // Sumar puntos al usuario
      await Usuario.findByIdAndUpdate(prediccion.usuario, {
        $inc: { puntosTotales: puntos }
      });
    }

    res.json({
      message: `Resultado guardado. ${predicciones.length} predicciones calculadas.`,
      partido
    });

  } catch (error) {
    res.status(500).json({ message: 'Error metiendo resultado', error: error.message });
  }
};

// Obtener todos los partidos para el admin
const getPartidosAdmin = async (req, res) => {
  try {
    const { faseId } = req.params;

    const partidos = await Partido.find({ fase: faseId })
      .populate('equipoLocal', 'nombre bandera')
      .populate('equipoVisitante', 'nombre bandera')
      .populate('fase', 'nombre')
      .sort({ fechaHora: 1 });

    res.json(partidos);

  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo partidos', error: error.message });
  }
};

// Obtener fases para el admin
const getFasesAdmin = async (req, res) => {
  try {
    const fases = await Fase.find().sort({ fechaLimite: 1 });
    res.json(fases);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo fases', error: error.message });
  }
};

module.exports = { meterResultado, getPartidosAdmin, getFasesAdmin };