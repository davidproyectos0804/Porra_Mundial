const express = require('express');
const router = express.Router();
const { meterResultado, getPartidosAdmin, getFasesAdmin } = require('../controllers/adminController');
const { protegerRuta, soloAdmin } = require('../middleware/authMiddleware');

// Todas las rutas de admin requieren estar logueado Y ser admin
router.use(protegerRuta, soloAdmin);

// GET /api/admin/fases
router.get('/fases', getFasesAdmin);

// GET /api/admin/partidos/fase/:faseId
router.get('/partidos/fase/:faseId', getPartidosAdmin);

// PUT /api/admin/partidos/:partidoId/resultado
router.put('/partidos/:partidoId/resultado', meterResultado);

module.exports = router;