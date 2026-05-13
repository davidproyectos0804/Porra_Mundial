const express = require('express');
const router = express.Router();
const { getPartidosPorFase, getFases } = require('../controllers/partidoController');
const { protegerRuta } = require('../middleware/authMiddleware');

// GET /api/partidos/fases - Obtener todas las fases
router.get('/fases', protegerRuta, getFases);

// GET /api/partidos/fase/:faseId - Obtener partidos de una fase
router.get('/fase/:faseId', protegerRuta, getPartidosPorFase);

module.exports = router;