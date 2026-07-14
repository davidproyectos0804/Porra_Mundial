const Partido = require('../models/Partido');
const Prediccion = require('../models/Prediccion');
const Usuario = require('../models/Usuario');
const Fase = require('../models/Fase');
const Equipo = require('../models/Equipo');

// Calcular puntos de una predicción
const calcularPuntos = (prediccion, golesLocalReal, golesVisitanteReal) => {
  const golesLocalPredicho = Number(prediccion.golesLocalPredicho);
  const golesVisitantePredicho = Number(prediccion.golesVisitantePredicho);
  const localReal = Number(golesLocalReal);
  const visitanteReal = Number(golesVisitanteReal);

  if (golesLocalPredicho === localReal && golesVisitantePredicho === visitanteReal) {
    return 500;
  }

  const ganadorReal = localReal > visitanteReal ? 'local'
    : localReal < visitanteReal ? 'visitante' : 'empate';

  const ganadorPredicho = golesLocalPredicho > golesVisitantePredicho ? 'local'
    : golesLocalPredicho < golesVisitantePredicho ? 'visitante' : 'empate';

  if (ganadorReal === ganadorPredicho) {
    return 200;
  }

  return 0;
};

// Meter resultado de un partido
const meterResultado = async (req, res) => {
  try {
    const { partidoId } = req.params;
    const golesLocal = Number(req.body.golesLocal);
    const golesVisitante = Number(req.body.golesVisitante);

    // Buscar y marcar como finalizado en una sola operación atómica
    const partido = await Partido.findOneAndUpdate(
      { _id: partidoId, finalizado: false }, // solo si NO está finalizado
      { golesLocal, golesVisitante, finalizado: true },
      { new: true }
    );

    // Si no encontró nada, es que ya estaba finalizado
    if (!partido) {
      return res.status(400).json({ message: 'Este partido ya tiene resultado' });
    }

    const predicciones = await Prediccion.find({ partido: partidoId });

    for (const prediccion of predicciones) {
      const puntos = calcularPuntos(prediccion, golesLocal, golesVisitante);
      prediccion.puntosObtenidos = puntos;
      await prediccion.save();
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

// Crear un partido nuevo
const crearPartido = async (req, res) => {
  try {
    const { fase, equipoLocal, equipoVisitante, fechaHora } = req.body;

    if (!fase || !equipoLocal || !equipoVisitante || !fechaHora) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    if (equipoLocal === equipoVisitante) {
      return res.status(400).json({ message: 'Un equipo no puede jugar contra sí mismo' });
    }

    const [faseExiste, localExiste, visitanteExiste] = await Promise.all([
      Fase.findById(fase),
      Equipo.findById(equipoLocal),
      Equipo.findById(equipoVisitante)
    ]);

    if (!faseExiste) return res.status(404).json({ message: 'La fase no existe' });
    if (!localExiste || !visitanteExiste) return res.status(404).json({ message: 'Alguno de los equipos no existe' });

    const partido = await Partido.create({ fase, equipoLocal, equipoVisitante, fechaHora });
    const partidoPopulado = await Partido.findById(partido._id)
      .populate('equipoLocal', 'nombre bandera')
      .populate('equipoVisitante', 'nombre bandera')
      .populate('fase', 'nombre');

    res.status(201).json({ message: 'Partido creado correctamente', partido: partidoPopulado });
  } catch (error) {
    res.status(500).json({ message: 'Error creando partido', error: error.message });
  }
};
const borrarPartido = async (req, res) => {
  try {
    const { partidoId } = req.params;

    const partido = await Partido.findById(partidoId);
    if (!partido) {
      return res.status(404).json({ message: 'El partido no existe' });
    }

    if (partido.finalizado) {
      return res.status(400).json({ message: 'No se puede borrar un partido que ya tiene resultado' });
    }

    await Partido.deleteOne({ _id: partidoId });

    res.json({ message: 'Partido borrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error borrando partido', error: error.message });
  }
};

module.exports = { meterResultado, getPartidosAdmin, getFasesAdmin, crearPartido, borrarPartido };