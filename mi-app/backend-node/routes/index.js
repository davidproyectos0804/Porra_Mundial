// Archivo de rutas principal
// Aquí se definen todos los endpoints de la API REST

const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');
const usersController = require('../controllers/usersController');
const authRoutes = require('./authRoutes');

// Rutas de prueba (se eliminarán más adelante)
router.get('/hello', helloController.getHello);
router.get('/users', usersController.getUsers);

// Rutas de autenticación
router.use('/auth', authRoutes);

module.exports = router;
