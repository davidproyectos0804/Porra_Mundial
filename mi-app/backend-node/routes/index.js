const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const partidoRoutes = require('./partidoRoutes');
const prediccionRoutes = require('./prediccionRoutes');
const rankingRoutes = require('./rankingRoutes');
const adminRoutes = require('./adminRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const prediccionEspecialRoutes = require('./prediccionEspecialRoutes');

router.use('/auth', authRoutes);
router.use('/partidos', partidoRoutes);
router.use('/predicciones', prediccionRoutes);
router.use('/ranking', rankingRoutes);
router.use('/admin', adminRoutes);
router.use('/usuario', usuarioRoutes);
router.use('/predicciones-especiales', prediccionEspecialRoutes);
module.exports = router;