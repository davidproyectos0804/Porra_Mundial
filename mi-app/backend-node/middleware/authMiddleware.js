const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
  try {
    // Coger el token del header Authorization
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: 'No tienes autorización, inicia sesión' });
    }

    // Verificar que el token es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardar los datos del usuario en la request para usarlos después
    req.usuario = decoded;
    
    next(); // Continuar con la siguiente función

  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administradores' });
  }
  next();
};

module.exports = { protegerRuta, soloAdmin };