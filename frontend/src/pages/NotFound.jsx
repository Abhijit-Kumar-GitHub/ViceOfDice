import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <Link to="/" className="mt-4 text-blue-400 hover:underline">
        Go Home
      </Link>
    </div>
  );
}
