const express = require('express');
const router = express.Router();
const { guardarPrediccion, getMisPredicciones, getPrediccionesUsuario } = require('../controllers/prediccionController');

const { protegerRuta } = require('../middleware/authMiddleware');

// POST /api/predicciones - Guardar o actualizar predicción
router.post('/', protegerRuta, guardarPrediccion);

// GET /api/predicciones/fase/:faseId - Obtener mis predicciones de una fase
router.get('/fase/:faseId', protegerRuta, getMisPredicciones);

// GET /api/predicciones/usuario/:usuarioId
router.get('/usuario/:usuarioId', protegerRuta, getPrediccionesUsuario);

module.exports = router;