const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const partidoRoutes = require('./partidoRoutes');
const prediccionRoutes = require('./prediccionRoutes');
const rankingRoutes = require('./rankingRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/auth', authRoutes);
router.use('/partidos', partidoRoutes);
router.use('/predicciones', prediccionRoutes);
router.use('/ranking', rankingRoutes);
router.use('/admin', adminRoutes);

module.exports = router;