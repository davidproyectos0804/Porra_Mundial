const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const partidoRoutes = require('./partidoRoutes');

router.use('/auth', authRoutes);
router.use('/partidos', partidoRoutes);

module.exports = router;