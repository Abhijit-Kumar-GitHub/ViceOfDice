const express = require("express");
const pool = require("../db"); // Import your PostgreSQL connection

const router = express.Router();

router.get("/:playerId", async (req, res) => {
  const { playerId } = req.params;

  try {
    const result = await pool.query("SELECT balance FROM players WHERE id = $1", [playerId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
