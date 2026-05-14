const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const partidoRoutes = require('./partidoRoutes');
const prediccionRoutes = require('./prediccionRoutes');
const rankingRoutes = require('./rankingRoutes');

router.use('/auth', authRoutes);
router.use('/partidos', partidoRoutes);
router.use('/predicciones', prediccionRoutes);
router.use('/ranking', rankingRoutes);

module.exports = router;