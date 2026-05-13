// Controlador para el endpoint /api/users
// Llama al servicio para obtener los datos de usuarios

const userService = require('../services/userService');

const getUsers = (req, res) => {
  try {
    const users = userService.getAllUsers();
    
    res.json(users); // ← directo, sin wrapper
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

module.exports = {
  getUsers
};
