const express = require('express');
const router = express.Router();
const {
  guardarPrediccionEspecial,
  getMisPrediccionesEspeciales,
  getEquipos,
  getJugadores,
  resolverPrediccionEspecial,
  getResultadosEspeciales,
  getEquiposConSub21,
  getPrediccionesEspecialesUsuario
} = require('../controllers/prediccionEspecialController');
const { protegerRuta, soloAdmin } = require('../middleware/authMiddleware');

// GET /api/predicciones-especiales
router.get('/', protegerRuta, getMisPrediccionesEspeciales);

// GET /api/predicciones-especiales/equipos
router.get('/equipos', protegerRuta, getEquipos);

// GET /api/predicciones-especiales/jugadores
router.get('/jugadores', protegerRuta, getJugadores);

// POST /api/predicciones-especiales
router.post('/', protegerRuta, guardarPrediccionEspecial);

// PUT /api/predicciones-especiales/resolver
router.put('/resolver', protegerRuta, soloAdmin, resolverPrediccionEspecial);

// GET /api/predicciones-especiales/resultados
router.get('/resultados', protegerRuta, getResultadosEspeciales);

// GET /api/predicciones-especiales/equipos-con-sub21
router.get('/equipos-con-sub21', protegerRuta, getEquiposConSub21);

// GET /api/predicciones-especiales/usuario/:id
router.get(
  '/usuario/:id',
  protegerRuta,
  getPrediccionesEspecialesUsuario
);

module.exports = router;