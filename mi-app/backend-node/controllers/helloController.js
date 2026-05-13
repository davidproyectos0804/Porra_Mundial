// Controlador para el endpoint /api/hello
// Los controladores manejan la lógica de cada endpoint

const getHello = (req, res) => {
  // Devolver un objeto JSON con un mensaje
  res.json({
    message: 'Hello from backend',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHello
};
