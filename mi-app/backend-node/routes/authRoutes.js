const express = require('express');
const router = express.Router();
const { register, login, verificarEmail } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verificar?token=xxx
router.get('/verificar', verificarEmail);

module.exports = router;