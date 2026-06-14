const Usuario = require('../models/Usuario');
const Prediccion = require('../models/Prediccion');

const getRanking = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select('nombre puntosTotales fotoPerfil')
      .lean();

    const stats = await Prediccion.aggregate([
      { $match: { puntosObtenidos: { $in: [500, 200, 0] } } },
      {
        $group: {
          _id: '$usuario',
          exactos: { $sum: { $cond: [{ $eq: ['$puntosObtenidos', 500] }, 1, 0] } },
          resultados: { $sum: { $cond: [{ $eq: ['$puntosObtenidos', 200] }, 1, 0] } },
          fallos: { $sum: { $cond: [{ $eq: ['$puntosObtenidos', 0] }, 1, 0] } }
        }
      }
    ]);

    const statsMap = new Map(stats.map(s => [s._id.toString(), s]));

    const ranking = usuarios
      .map(u => ({
        ...u,
        exactos: statsMap.get(u._id.toString())?.exactos || 0,
        resultados: statsMap.get(u._id.toString())?.resultados || 0,
        fallos: statsMap.get(u._id.toString())?.fallos || 0
      }))
      .sort((a, b) => {
        if (b.puntosTotales !== a.puntosTotales) return b.puntosTotales - a.puntosTotales;
        if (b.exactos !== a.exactos) return b.exactos - a.exactos;
        if (b.resultados !== a.resultados) return b.resultados - a.resultados;
        if (a.fallos !== b.fallos) return a.fallos - b.fallos;
        return a.nombre.localeCompare(b.nombre);
      });

    res.json({
      total: ranking.length,
      ranking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo ranking', error: error.message });
  }
};

module.exports = { getRanking };