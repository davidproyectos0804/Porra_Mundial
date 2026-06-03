const PrediccionEspecial = require('../models/PrediccionEspecial');
const Equipo = require('../models/Equipo');
const Usuario = require('../models/Usuario');
const Jugador = require('../models/Jugador');

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

    // Comprobar si este tipo ya fue resuelto por el admin
    const tipoResuelto = await PrediccionEspecial.findOne({
      tipo,
      puntosObtenidos: { $ne: null }
    });

    if (tipoResuelto) {
      return res.status(400).json({ message: 'Esta predicción ya ha sido resuelta y no se puede cambiar' });
    }

    // Comprobar si el usuario ya tiene esta predicción resuelta
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

    // 1. Obtener todas las predicciones del usuario sin poblar
    const prediccionesSinPoblar = await PrediccionEspecial.find({ usuario: usuarioId }).lean();

    // 2. Separar por tipo de valor
    const prediccionesEquipo = prediccionesSinPoblar.filter(p => p.tipoValor === 'Equipo');
    const prediccionesJugador = prediccionesSinPoblar.filter(p => p.tipoValor === 'Jugador');

    // 3. Poblar equipos (solo el equipo referenciado)
    const equiposPoblados = await PrediccionEspecial.populate(prediccionesEquipo, {
      path: 'valorPredicho',
      select: 'nombre bandera'
    });

    // 4. Poblar jugadores (con su equipo anidado)
    const jugadoresPoblados = await PrediccionEspecial.populate(prediccionesJugador, {
      path: 'valorPredicho',
      select: 'nombre posicion equipo',
      populate: {
        path: 'equipo',
        select: 'nombre bandera'
      }
    });

    // 5. Unir resultados
    const predicciones = [...equiposPoblados, ...jugadoresPoblados];

    // 6. Obtener tipos ya resueltos globalmente
    const tiposResueltos = await PrediccionEspecial.distinct('tipo', {
      puntosObtenidos: { $ne: null }
    });

    res.json({ predicciones, tiposResueltos });

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
const getJugadores = async (req, res) => {
  try {
    const { equipoId, posicion, soloSub21 } = req.query;
    const filtro = {};

    if (equipoId) filtro.equipo = equipoId;
    if (posicion) filtro.posicion = posicion;
    if (soloSub21 === 'true') {
      filtro.fechaNacimiento = { $gte: new Date('2005-06-01') };
    }

    const ordenPosicion = { 'Portero': 1, 'Defensa': 2, 'Centrocampista': 3, 'Delantero': 4 };

    const jugadores = await Jugador.find(filtro)
      .select('nombre equipo posicion fechaNacimiento')
      .populate('equipo', 'nombre bandera')
      .lean();

    jugadores.sort((a, b) => {
      const ordenA = ordenPosicion[a.posicion] ?? 5;
      const ordenB = ordenPosicion[b.posicion] ?? 5;
      if (ordenA !== ordenB) return ordenA - ordenB;
      return a.nombre.localeCompare(b.nombre); // dentro de cada posición, alfabético
    });

    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo jugadores', error: error.message });
  }
};
const resolverPrediccionEspecial = async (req, res) => {
  try {
    const { tipo, valorCorrecto } = req.body;

    // Bloquear si ya está resuelto
    const yaResuelto = await PrediccionEspecial.findOne({
      tipo,
      puntosObtenidos: { $ne: null }
    });

    if (yaResuelto) {
      return res.status(400).json({ message: 'Esta predicción ya fue resuelta y no se puede cambiar' });
    }

    const predicciones = await PrediccionEspecial.find({ tipo });

    const bulkOps = predicciones.map(prediccion => {
      const puntos = prediccion.valorPredicho.toString() === valorCorrecto ? 1000 : 0;
      return {
        updateOne: {
          filter: { _id: prediccion._id },
          update: { $set: { puntosObtenidos: puntos } }
        }
      };
    });

    if (bulkOps.length > 0) {
      await PrediccionEspecial.bulkWrite(bulkOps);
    }

    const acertaron = predicciones.filter(p => p.valorPredicho.toString() === valorCorrecto);
    if (acertaron.length > 0) {
      const usuariosIds = acertaron.map(p => p.usuario);
      await Usuario.updateMany(
        { _id: { $in: usuariosIds } },
        { $inc: { puntosTotales: 1000 } }
      );
    }

    // Guardar el valor correcto en un modelo aparte o en una colección de resultados
    res.json({ message: `Resuelto. ${acertaron.length} usuarios acertaron.`, valorCorrecto });

  } catch (error) {
    res.status(500).json({ message: 'Error resolviendo predicción', error: error.message });
  }
};
const getResultadosEspeciales = async (req, res) => {
  try {
    const tipos = [
      ...TIPOS_EQUIPO.map(t => ({ tipo: t, tipoValor: 'Equipo' })),
      ...TIPOS_JUGADOR.map(t => ({ tipo: t, tipoValor: 'Jugador' }))
    ];

    const resultados = [];

    for (const { tipo, tipoValor } of tipos) {
      // Buscar solo predicciones con 1000 puntos (aciertos) para obtener el valor correcto
      const resuelta = await PrediccionEspecial.findOne({
        tipo,
        puntosObtenidos: 1000   // ← aquí está el cambio clave
      }).lean();

      if (!resuelta) continue;

      let valorCorrecto;
      if (tipoValor === 'Equipo') {
        valorCorrecto = await Equipo.findById(resuelta.valorPredicho).select('nombre bandera').lean();
      } else {
        valorCorrecto = await Jugador.findById(resuelta.valorPredicho)
          .select('nombre posicion equipo')
          .populate('equipo', 'nombre bandera')
          .lean();
      }

      if (valorCorrecto) {
        resultados.push({ tipo, tipoValor, valorCorrecto });
      }
    }

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo resultados', error: error.message });
  }
};
module.exports = {
  guardarPrediccionEspecial,
  getMisPrediccionesEspeciales,
  getEquipos,
  getJugadores,
  resolverPrediccionEspecial,
  getResultadosEspeciales
};
