import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="mt-[8vh] bg-gray-900 flex items-start justify-center">
        <Outlet />
      </main>
    </div>
  );
}
