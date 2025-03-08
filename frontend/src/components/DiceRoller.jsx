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
      const response = await fetch("https://viceofdicedb.onrender.com/api/dice", {
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
    <div className="text-center items-start justify-center text-white flex flex-col lg:flex-row gap-6">
      {/* Dice Game Section */}
      <div className="flex flex-col items-center jusitfy-center w-full p-4">
        <div className="mb-6 text-2xl w-[25vw] font-bold text-green-400">
          💳 Balance: {balance} Coins
        </div>

        <input
          
          type="number"
          placeholder="Enter bet amount"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="px-4 py-2 border rounded-md text-white mb-4 w-[17vw] bg-gray-900"
        />
        <button
          onClick={rollDice}
          className="w-[17vw] px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-lg"
          disabled={loading}
        >
          {loading ? "Rolling..." : "Roll Dice 🎲"}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Display Game Outcome */}
        {gameOutcome?.gameOutcome && (
          <div className="w-[40vw] mt-6 p-4 border rounded-md bg-gray-800">
            <h2 className="text-xl font-bold mb-2">Game Outcome</h2>
            <p>🎲 Dice Roll: {gameOutcome.gameOutcome.diceRoll}</p>
            <p>📢 Result: {gameOutcome.gameOutcome.result?.toUpperCase() || "N/A"}</p>
            <p>💰 Payout: {gameOutcome.winnings || 0}</p>
            <p>💳 New Balance: {gameOutcome.newBalance}</p>
            <p className="text-gray-400 text-sm">🕒 {new Date(gameOutcome.gameOutcome.timestamp).toLocaleString()}</p>
          </div>
        )}

        {/* Transaction History */}
        {history.length > 0 && (
          <div className="w-[40vw] mt-8 p-4 border rounded-md bg-gray-800">
            <h2 className="text-xl font-bold mb-2">Transaction History</h2>
            <ul className="space-y-2 text-sm">
              {history.map((item, index) => (
                <li key={index} className="border-b pb-2 last:border-b-0">
                  🎲 Roll: {item.gameOutcome?.diceRoll || "N/A"} | 
                  📢 {item.gameOutcome?.result?.toUpperCase() || "N/A"} | 
                  💰 {item.gameOutcome?.winnings || 0}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Provably Fair Section */}
      {gameOutcome?.provablyFair && (
        <div className="w-[40vw] p-4 border rounded-md bg-gray-800 text-left">
          <h2 className="text-xl font-bold text-green-400 mb-2">🎲 Provably Fair</h2>
          <p className="text-sm text-gray-300">
            The dice roll is generated using a secure SHA-256 hash, ensuring fairness. 
            You can verify the outcome by hashing the server and client seeds.
          </p>
          <div className="mt-4 p-3 bg-gray-900 rounded-md text-xs overflow-x-auto">
            <p className="text-gray-400">🖥️ <strong>Server Seed:</strong></p>
            <p className="break-all">{gameOutcome.provablyFair.serverSeed}</p>

            <p className="mt-2 text-gray-400">📱 <strong>Client Seed:</strong></p>
            <p className="break-all">{gameOutcome.provablyFair.clientSeed}</p>

            <p className="mt-2 text-gray-400">🔗 <strong>SHA-256 Hash:</strong></p>
            <p className="break-all">{gameOutcome.provablyFair.hash}</p>
          </div>
        </div>
      )}
    </div>
  );
}
