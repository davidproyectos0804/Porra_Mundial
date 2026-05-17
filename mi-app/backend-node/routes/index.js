const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const partidoRoutes = require('./partidoRoutes');
const prediccionRoutes = require('./prediccionRoutes');
const rankingRoutes = require('./rankingRoutes');
const adminRoutes = require('./adminRoutes');
const usuarioRoutes = require('./usuarioRoutes');

router.use('/auth', authRoutes);
router.use('/partidos', partidoRoutes);
router.use('/predicciones', prediccionRoutes);
router.use('/ranking', rankingRoutes);
router.use('/admin', adminRoutes);
router.use('/usuario', usuarioRoutes);

module.exports = router;