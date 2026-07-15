const PrediccionEspecial = require('../models/PrediccionEspecial');
const ResultadoEspecial = require('../models/ResultadoEspecial');
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
    const tipoResuelto = await ResultadoEspecial.findOne({ tipo });

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
    const tiposResueltos = await ResultadoEspecial.distinct('tipo');

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
    const yaResuelto = await ResultadoEspecial.findOne({ tipo });

    if (yaResuelto) {
      return res.status(400).json({ message: 'Esta predicción ya fue resuelta y no se puede cambiar' });
    }

    const tipoValor = TIPOS_EQUIPO.includes(tipo) ? 'Equipo' : 'Jugador';

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

    // Guardar el resultado oficial de forma independiente,
    // así queda registrado aunque nadie lo haya acertado
    await ResultadoEspecial.create({ tipo, tipoValor, valorCorrecto });

    res.json({ message: `Resuelto. ${acertaron.length} usuarios acertaron.`, valorCorrecto });

  } catch (error) {
    res.status(500).json({ message: 'Error resolviendo predicción', error: error.message });
  }
};

const getResultadosEspeciales = async (req, res) => {
  try {
    const resultadosGuardados = await ResultadoEspecial.find().lean();
    const resultados = [];

    for (const { tipo, tipoValor, valorCorrecto } of resultadosGuardados) {
      let valorPoblado;
      if (tipoValor === 'Equipo') {
        valorPoblado = await Equipo.findById(valorCorrecto).select('nombre bandera').lean();
      } else {
        valorPoblado = await Jugador.findById(valorCorrecto)
          .select('nombre posicion equipo')
          .populate('equipo', 'nombre bandera')
          .lean();
      }

      if (valorPoblado) {
        resultados.push({ tipo, tipoValor, valorCorrecto: valorPoblado });
      }
    }

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo resultados', error: error.message });
  }
};

const getEquiposConSub21 = async (req, res) => {
  try {
    const fechaLimite = new Date('2005-06-01');

    const equiposConSub21 = await Jugador.distinct('equipo', {
      fechaNacimiento: { $gte: fechaLimite }
    });

    const equipos = await Equipo.find({
      _id: { $in: equiposConSub21 }
    }).select('nombre bandera').sort({ nombre: 1 });

    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo equipos con sub21', error: error.message });
  }
};

const getPrediccionesEspecialesUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const prediccionesSinPoblar = await PrediccionEspecial.find({
      usuario: usuarioId
    }).lean();

    const prediccionesEquipo = prediccionesSinPoblar.filter(
      p => p.tipoValor === 'Equipo'
    );

    const prediccionesJugador = prediccionesSinPoblar.filter(
      p => p.tipoValor === 'Jugador'
    );

    const equiposPoblados = await PrediccionEspecial.populate(
      prediccionesEquipo,
      {
        path: 'valorPredicho',
        select: 'nombre bandera'
      }
    );

    const jugadoresPoblados = await PrediccionEspecial.populate(
      prediccionesJugador,
      {
        path: 'valorPredicho',
        select: 'nombre posicion equipo',
        populate: {
          path: 'equipo',
          select: 'nombre bandera'
        }
      }
    );

    const predicciones = [...equiposPoblados, ...jugadoresPoblados];

    res.json(predicciones);

  } catch (error) {
    res.status(500).json({
      message: 'Error obteniendo predicciones especiales',
      error: error.message
    });
  }
};

module.exports = {
  guardarPrediccionEspecial,
  getMisPrediccionesEspeciales,
  getEquipos,
  getJugadores,
  resolverPrediccionEspecial,
  getResultadosEspeciales,
  getEquiposConSub21,
  getPrediccionesEspecialesUsuario
};