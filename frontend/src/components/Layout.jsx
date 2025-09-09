// import { Outlet } from "react-router-dom";
// import { Navbar } from "./Navbar";
// import { Sidebar } from "./Sidebar";
// import { MusicPlayer } from "./MusicPlayer";
// import { Home } from "../pages/Home";
// import { Toaster } from "react-hot-toast";

// export const Layout = ({ children }) => {
//   return (
//     <div className="h-screen">
//         <Toaster position="top-right" />
//       <div className="flex h-[90%]">
//         <Sidebar />
//         <div className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0   overflow-x-auto
//           scroll-smooth
//           scrollbar-hidden
//           snap-x snap-mandatory">
//           <Navbar />
//           <Home />
//           <Outlet />
//         </div>
//       </div>
//       <MusicPlayer />
//     </div>
//   );
// };
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MusicPlayer } from "./MusicPlayer";
import { Toaster } from "react-hot-toast";

export const Layout = () => {
  return (
    <div className="h-screen">
      <Toaster position="top-right" />
      <div className="flex h-[90%]">
        <Sidebar />
        <div
          className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto 
                     lg:w-[75%] lg:ml-0 overflow-x-auto scroll-smooth scrollbar-hidden snap-x snap-mandatory"
        >
          <Navbar />
          <Outlet /> {/* This renders the current page (Home, AlbumPage, etc.) */}
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};
