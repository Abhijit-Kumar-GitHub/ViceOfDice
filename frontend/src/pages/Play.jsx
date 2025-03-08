import DiceRoller from "../components/DiceRoller";
import usePlayer from "../hooks/usePlayer";

export default function Play() {
  const { playerId, username, balance, setBalance, fetchBalance } = usePlayer();

  if (!playerId) {
    return <p className="text-white text-center mt-10">Please register or log in to play.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-4">Welcome, {username}!</h1>
      <p className="text-lg text-white mb-6">Balance: {balance !== null ? balance : "Loading..."}</p>

      {/* ✅ Pass setBalance directly so DiceRoller can update balance */}
      <DiceRoller updateBalance={setBalance} />
    </div>
  );
}
