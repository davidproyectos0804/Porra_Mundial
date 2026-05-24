const express = require('express');
const router = express.Router();
const {
  guardarPrediccionEspecial,
  getMisPrediccionesEspeciales,
  getEquipos,
  resolverPrediccionEspecial
} = require('../controllers/prediccionEspecialController');
const { protegerRuta, soloAdmin } = require('../middleware/authMiddleware');

// GET /api/predicciones-especiales
router.get('/', protegerRuta, getMisPrediccionesEspeciales);

// GET /api/predicciones-especiales/equipos
router.get('/equipos', protegerRuta, getEquipos);

// POST /api/predicciones-especiales
router.post('/', protegerRuta, guardarPrediccionEspecial);

// PUT /api/predicciones-especiales/resolver
router.put('/resolver', protegerRuta, soloAdmin, resolverPrediccionEspecial);

module.exports = router;