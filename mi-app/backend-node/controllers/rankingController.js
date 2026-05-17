const Usuario = require('../models/Usuario');

const getRanking = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select('nombre puntosTotales fotoPerfil')
      .sort({ puntosTotales: -1 });

    res.json(usuarios);

  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo ranking', error: error.message });
  }
};

module.exports = { getRanking };