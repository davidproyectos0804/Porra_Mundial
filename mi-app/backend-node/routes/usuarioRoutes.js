const express = require('express');
const router = express.Router();
const { subirFotoPerfil, getMiPerfil, cambiarNombre } = require('../controllers/usuarioController');
const { protegerRuta } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET /api/usuario/perfil
router.get('/perfil', protegerRuta, getMiPerfil);

// POST /api/usuario/foto
router.post('/foto', protegerRuta, upload.single('foto'), subirFotoPerfil);
router.put('/nombre', protegerRuta, cambiarNombre);
module.exports = router;