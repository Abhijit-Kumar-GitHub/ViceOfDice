const express = require('express');
const router = express.Router();
const { rollDice } = require('../controllers/diceController');

router.post('/', rollDice);

module.exports = router;
