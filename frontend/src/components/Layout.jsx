import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "./MusicPlayer";
import { Home } from "../pages/Home";

export const Layout = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="flex h-[90%]">
        <Sidebar />
        <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
          <Navbar />
          <Outlet />
          <Home />
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};
