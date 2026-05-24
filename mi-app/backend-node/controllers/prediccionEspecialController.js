const PrediccionEspecial = require('../models/PrediccionEspecial');
const Equipo = require('../models/Equipo');
const Usuario = require('../models/Usuario');

const TIPOS_EQUIPO = [
  'Ganador del mundial',
  'Subcampeon',
  'Seleccion decepcion',
  'Mejor anfitrion',
  'Equipo mas goleador',
  'Equipo menos goleado',
  'Equipo sorpresa'
];

const TIPOS_JUGADOR = [
  'Goleador',
  'MVP del mundial',
  'Mejor portero',
  'Maximo asistente',
  'Mejor jugador joven'
];

const guardarPrediccionEspecial = async (req, res) => {
  try {
    const { tipo, valorPredicho } = req.body;
    const usuarioId = req.usuario.id;

    if (!tipo || !valorPredicho) {
      return res.status(400).json({ message: 'Tipo y valor son obligatorios' });
    }

    const prediccionExistente = await PrediccionEspecial.findOne({ usuario: usuarioId, tipo });
    if (prediccionExistente && prediccionExistente.puntosObtenidos !== null) {
      return res.status(400).json({ message: 'Esta predicción ya ha sido resuelta y no se puede cambiar' });
    }

    const tipoValor = TIPOS_EQUIPO.includes(tipo) ? 'Equipo' : 'Jugador';

    const prediccion = await PrediccionEspecial.findOneAndUpdate(
      { usuario: usuarioId, tipo },
      { valorPredicho, tipoValor },
      { upsert: true, returnDocument: 'after' }
    );

    res.json({ message: 'Predicción especial guardada', prediccion });

  } catch (error) {
    res.status(500).json({ message: 'Error guardando predicción especial', error: error.message });
  }
};

const getMisPrediccionesEspeciales = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const predicciones = await PrediccionEspecial.find({ usuario: usuarioId })
      .populate('valorPredicho', 'nombre bandera');

    res.json(predicciones);

  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo predicciones especiales', error: error.message });
  }
};

const getEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.find().select('nombre bandera').sort({ nombre: 1 });
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo equipos', error: error.message });
  }
};

const resolverPrediccionEspecial = async (req, res) => {
  try {
    const { tipo, valorCorrecto } = req.body;

    // Comprobar si ya está resuelto
    const yaResuelto = await PrediccionEspecial.findOne({
      tipo,
      puntosObtenidos: { $ne: null }
    });

    if (yaResuelto) {
      return res.status(400).json({ message: 'Esta predicción especial ya fue resuelta y no se puede cambiar' });
    }

    const predicciones = await PrediccionEspecial.find({ tipo });

    let acertaron = 0;
    for (const prediccion of predicciones) {
      const puntos = prediccion.valorPredicho.toString() === valorCorrecto ? 1000 : 0;
      prediccion.puntosObtenidos = puntos;
      await prediccion.save();

      if (puntos > 0) {
        await Usuario.findByIdAndUpdate(prediccion.usuario, {
          $inc: { puntosTotales: puntos }
        });
        acertaron++;
      }
    }

    res.json({ message: `Resuelto. ${acertaron} usuarios acertaron.` });

  } catch (error) {
    res.status(500).json({ message: 'Error resolviendo predicción', error: error.message });
  }
};

module.exports = {
  guardarPrediccionEspecial,
  getMisPrediccionesEspeciales,
  getEquipos,
  resolverPrediccionEspecial
};