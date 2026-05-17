const Usuario = require('../models/Usuario');
const cloudinary = require('../services/cloudinaryService');

const subirFotoPerfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    // Subir a Cloudinary desde el buffer
    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'porra_mundial/avatares',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Guardar URL en la base de datos
    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { fotoPerfil: resultado.secure_url },
      { new: true }
    ).select('-password -tokenVerificacion');

    res.json({
      message: 'Foto actualizada',
      fotoPerfil: usuario.fotoPerfil
    });

  } catch (error) {
    res.status(500).json({ message: 'Error subiendo imagen', error: error.message });
  }
};

const getMiPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
      .select('-password -tokenVerificacion');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo perfil', error: error.message });
  }
};

module.exports = { subirFotoPerfil, getMiPerfil };