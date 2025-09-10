// Layout.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "./MusicPlayer";
import { Toaster } from "react-hot-toast";
import { Footer } from "./Footer";
import Confetti from "react-confetti";

export const Layout = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-09-10"
    const lastShown = localStorage.getItem("confetti-shown-date");

    if (lastShown !== today) {
      setShowConfetti(true);
      localStorage.setItem("confetti-shown-date", today);

      // Auto stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, []);

  return (
    <div className="h-screen">
      <Toaster position="top-right" />
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      <div className="flex h-[90%]">
        <Sidebar />
        <div
          className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto 
                     lg:w-[75%] lg:ml-0 overflow-x-auto scroll-smooth scrollbar-hidden snap-x snap-mandatory"
        >
          <Navbar />
          <Outlet /> {/* Current page (Home, AlbumPage, etc.) */}
          <Footer />
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};
