const crypto = require('crypto');
const { getPlayerById, updatePlayerBalance } = require('../models/playerModel');
const { logGameOutcome } = require('../models/gameModel');

const rollDice = async (req, res) => {
  try {
    const { playerId, betAmount } = req.body;
    if (!playerId || !betAmount || betAmount <= 0) {
      return res.status(400).json({ error: 'Invalid player ID or bet amount' });
    }

    // Fetch player details
    const player = await getPlayerById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    if (betAmount > player.balance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate provably fair dice roll
    const serverSeed = crypto.randomBytes(16).toString('hex');
    const clientSeed = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256').update(serverSeed + clientSeed).digest('hex');
    const diceRoll = (parseInt(hash.substring(0, 2), 16) % 6) + 1; // number 1-6

    let newBalance, winnings = 0, result;
    if (diceRoll >= 4) {
      // winnings = betAmount * 2;                // right now what is happening is that if bet 100 of 1000 after winning i am getting 1200 instead of 1100.
      winnings = betAmount;                       // so i have changed it to betAmount
      newBalance = player.balance + winnings;
      result = 'win';
    } else {
      newBalance = player.balance - betAmount;
      result = 'lose';
    }

    // Update player's balance
    const updatedPlayer = await updatePlayerBalance(playerId, newBalance);

    // Log game outcome (optional)
    const gameOutcome = await logGameOutcome(playerId, betAmount, diceRoll, result, winnings);

    res.json({
      message: result === 'win' ? 'You win!' : 'You lose!',
      diceRoll,
      winnings,
      newBalance: updatedPlayer.balance,
      provablyFair: { serverSeed, clientSeed, hash },
      gameOutcome
    });
  } catch (error) {
    console.error('Dice Roll Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { rollDice };
