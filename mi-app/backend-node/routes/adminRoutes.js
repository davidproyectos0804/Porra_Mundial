const express = require('express');
const router = express.Router();
const { meterResultado, getPartidosAdmin, getFasesAdmin, crearPartido, borrarPartido } = require('../controllers/adminController');
const { protegerRuta, soloAdmin } = require('../middleware/authMiddleware');

// Todas las rutas de admin requieren estar logueado Y ser admin
router.use(protegerRuta, soloAdmin);

// GET /api/admin/fases
router.get('/fases', getFasesAdmin);

// GET /api/admin/partidos/fase/:faseId
router.get('/partidos/fase/:faseId', getPartidosAdmin);

// POST /api/admin/partidos
router.post('/partidos', crearPartido);

// PUT /api/admin/partidos/:partidoId/resultado
router.put('/partidos/:partidoId/resultado', meterResultado);

// DELETE /api/admin/partidos/:partidoId
router.delete('/partidos/:partidoId', borrarPartido);

module.exports = router;