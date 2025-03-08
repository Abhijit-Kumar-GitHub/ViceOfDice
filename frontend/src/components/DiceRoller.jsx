import { useState } from "react";
import usePlayer from "../hooks/usePlayer";

export default function DiceRoller() {
  const { playerId, balance, setBalance } = usePlayer();
  const [betAmount, setBetAmount] = useState("");
  const [gameOutcome, setGameOutcome] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rollDice = async () => {
    const betValue = Number(betAmount);

    if (!betAmount || isNaN(betValue) || betValue <= 0) {
      setError("Please enter a valid bet amount.");
      return;
    }

    if (!playerId) {
      setError("Player ID not found. Please register first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/dice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, betAmount: betValue }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to roll the dice");

      setGameOutcome(data);
      setHistory((prev) => [data, ...prev.slice(0, 9)]);
      setBalance(data.newBalance);
      localStorage.setItem("balance", data.newBalance);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  if (!playerId) {
    return <p className="text-white text-center mt-10">Please register or log in to play.</p>;
  }

  return (
    <div className="text-center text-white">
      <div className="mb-6 text-2xl font-bold text-green-400">
        💳 Balance: {balance} Coins
      </div>

      <input
        type="number"
        placeholder="Enter bet amount"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        className="px-4 py-2 border rounded-md text-white mb-4 w-full bg-gray-900"
      />
      <button
        onClick={rollDice}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-lg"
        disabled={loading}
      >
        {loading ? "Rolling..." : "Roll Dice 🎲"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {gameOutcome && (
        <div className="mt-6 p-4 border rounded-md bg-gray-800">
          <h2 className="text-xl font-bold mb-2">Game Outcome</h2>
          <p>🎲 Dice Roll: {gameOutcome.gameOutcome.diceRoll}</p>
          <p>📢 Result: {gameOutcome.gameOutcome.result.toUpperCase()}</p>
          <p>💰 Payout: {gameOutcome.gameOutcome.payout}</p>
          <p>💳 New Balance: {gameOutcome.newBalance}</p>
          <p className="text-gray-400 text-sm">🕒 {new Date(gameOutcome.gameOutcome.timestamp).toLocaleString()}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 p-4 border rounded-md bg-gray-800">
          <h2 className="text-xl font-bold mb-2">Transaction History</h2>
          <ul className="space-y-2 text-sm">
            {history.map((item, index) => (
              <li key={index} className="border-b pb-2 last:border-b-0">
                🎲 Roll: {item.gameOutcome.diceRoll} | 📢 {item.gameOutcome.result.toUpperCase()} | 💰 {item.gameOutcome.payout}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
