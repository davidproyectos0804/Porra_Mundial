const express = require('express');
const router = express.Router();
const { getRanking } = require('../controllers/rankingController');
const { protegerRuta } = require('../middleware/authMiddleware');

// GET /api/ranking
router.get('/', protegerRuta, getRanking);

module.exports = router;