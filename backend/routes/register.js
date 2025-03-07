const express = require('express');
const router = express.Router();
const { registerPlayer } = require('../controllers/registerController');

router.post('/', registerPlayer);

module.exports = router;
