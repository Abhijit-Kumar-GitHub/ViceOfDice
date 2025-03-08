const { v4: uuidv4 } = require('uuid');
const { createPlayer } = require('../models/playerModel');

const registerPlayer = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const playerId = uuidv4();
    const player = await createPlayer(username, playerId);

    if (!player) {
      return res.status(500).json({ error: 'Failed to create player' });
    }

    res.status(201).json({
      message: 'Player registered successfully',
      playerId: player.id, 
      username: player.username,
      balance: player.balance // Default balance = 1000
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { registerPlayer };
