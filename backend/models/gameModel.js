const db = require('../db'); // Ensure this connects to your database

const logGameOutcome = async (playerId, betAmount, diceRoll, result, winnings) => {
  const query = `
    INSERT INTO game_logs (player_id, bet_amount, dice_roll, result, winnings, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *, created_at AS timestamp;
  `;
  const values = [playerId, betAmount, diceRoll, result, winnings];
  const { rows } = await db.query(query, values);
  return rows[0]; // Ensure timestamp is included in response
};


const getGameHistory = async (playerId) => {
  const query = `
    SELECT bet_amount, dice_roll, result, winnings, created_at
    FROM game_logs
    WHERE player_id = $1
    ORDER BY created_at DESC
    LIMIT 10;
  `;
  const { rows } = await db.query(query, [playerId]);
  return rows;
};

module.exports = { logGameOutcome, getGameHistory };
