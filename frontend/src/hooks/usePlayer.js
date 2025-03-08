import { useState, useEffect } from "react";

export default function usePlayer() {
  const [playerId, setPlayerId] = useState(localStorage.getItem("playerId") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [balance, setBalance] = useState(Number(localStorage.getItem("balance")) || 1000);

  useEffect(() => {
    if (playerId) {
      fetchBalance(playerId);
    }
  }, [playerId]);

  const login = (id, name, bal) => {
    localStorage.setItem("playerId", id);
    localStorage.setItem("username", name);
    localStorage.setItem("balance", bal);
    setPlayerId(id);
    setUsername(name);
    setBalance(bal); // ✅ Now correctly sets balance
  };

  const logout = () => {
    localStorage.removeItem("playerId");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    setPlayerId(null);
    setUsername(null);
    setBalance(1000);
  };

  const fetchBalance = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/balance/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch balance.");
      }

      setBalance(data.balance);
      localStorage.setItem("balance", data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return { playerId, username, balance, setBalance, login, logout, fetchBalance };
}
