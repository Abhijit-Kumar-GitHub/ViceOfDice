const pool = require('../db');

const createPlayer = async (username, playerId) => {
  const query = `
    INSERT INTO players (id, username, balance) 
    VALUES ($1, $2, 1000) 
    RETURNING id, username, balance;
  `;
  const values = [playerId, username];
  const result = await pool.query(query, values);
  return result.rows[0]; // Return only relevant fields
};

const getPlayerById = async (playerId) => {
  const query = 'SELECT * FROM players WHERE id = $1';
  const result = await pool.query(query, [playerId]);
  return result.rows[0];
};

const updatePlayerBalance = async (playerId, newBalance) => {
  const query = 'UPDATE players SET balance = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [newBalance, playerId]);
  return result.rows[0];
};

module.exports = {
  createPlayer,
  getPlayerById,
  updatePlayerBalance
};
