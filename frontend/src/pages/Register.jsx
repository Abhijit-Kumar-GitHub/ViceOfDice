import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlayer from "../hooks/usePlayer";

export default function Register() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = usePlayer(); // Automatically updates state

  const registerPlayer = async () => {
    if (!username.trim()) {
      setError("Enter a valid username.");
      return;
    }

    try {
      const response = await fetch("https://viceofdicedb.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      // ✅ Store player data dynamically using `usePlayer()`
      login(data.playerId, data.username, data.balance);

      // ✅ Redirect to play page (no reload needed)
      navigate("/play");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-4">Register Player</h1>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-4 py-2 border rounded-md text-white mb-4 w-full bg-gray-900"
      />

      <button
        onClick={registerPlayer}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-white text-lg"
      >
        Register
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
