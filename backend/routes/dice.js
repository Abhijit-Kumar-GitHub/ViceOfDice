const express = require('express');
const router = express.Router();
const { rollDice } = require('../controllers/diceController');
const { getGameHistory } = require('../models/gameModel');

router.post('/', rollDice);


router.get('/history/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const history = await getGameHistory(playerId);
    res.json(history);
  } catch (error) {
    console.error('Game History Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
