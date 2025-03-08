import { Link, useNavigate } from "react-router-dom";
import usePlayer from "../hooks/usePlayer";

export default function Navbar() {
  const { playerId, username, logout } = usePlayer();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🎲 ViceOfDice</h1>
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-400">Home</Link>
        <Link to="/play" className="hover:text-gray-400">Play</Link>

        {playerId ? (
          <>
            <span className="text-green-400"> {username}</span>
            <button onClick={handleLogout} className="hover:text-red-500">
              Logout
            </button>
          </>
        ) : (
          <Link to="/register" className="hover:text-gray-400">Register</Link>
        )}
      </div>
    </nav>
  );
}
