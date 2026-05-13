// Archivo de rutas principal
// Aquí se definen todos los endpoints de la API REST

const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');
const usersController = require('../controllers/usersController');

// Endpoint: GET /api/hello
// Devuelve un mensaje de saludo desde el backend
router.get('/hello', helloController.getHello);

// Endpoint: GET /api/users
// Devuelve una lista mock de usuarios
router.get('/users', usersController.getUsers);

module.exports = router;
