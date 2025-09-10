import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

export const Navbar = () => {
  const { user, HandleLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-[#121212] text-gray-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
         <Link to={"/"}>
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">Gana11</h1>
          </div>
         </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <Link to="/premium" className="text-white font-semibold">
              Premium
            </Link>
            <Link to="/albums" className="hover:text-white transition">
              Albums
            </Link>
            <Link to="/support" className="hover:text-white transition">
              Contact
            </Link>
          </div>

          {/* Desktop Button */}
          <div className="hidden md:flex">
            {user ? (
              <button className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition">
                Logout
              </button>
            ) : (
              <button className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition">
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isOpen ? (
                <HiX className="text-white w-6 h-6" />
              ) : (
                <HiMenu className="text-white w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#121212] px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block text-gray-300 hover:text-white transition">
            Home
          </Link>
          <Link to="/premium" className="block text-white font-semibold">
            Premium
          </Link>
          <Link to="/" className="block text-gray-300 hover:text-white transition">
            Albums
          </Link>
          <Link to="/" className="block text-gray-300 hover:text-white transition">
            Contact
          </Link>
          {user ? (
            <button onClick={HandleLogout} className="w-full bg-white text-gray-900 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition mt-2">
              Logout
            </button>
          ) : (
           <Link to={"/sign-in"}>
            <button className="w-full bg-white text-gray-900 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition mt-2">
              Login
            </button>
           </Link>
          )}
        </div>
      )}
    </nav>
  );
};
