// src/pages/PremiumPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Footer } from "./Footer";

export const PremiumPage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Navbar */}
      <nav className="w-full bg-[#121212] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
           <Link to={"/"}>
           <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-yellow-400">Gana11</h1>
            </div> 
           </Link>
            {/* Menu */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-yellow-400 transition">
                Home
              </Link>
              <Link to="/premium" className="text-yellow-400 font-semibold">
                Premium
              </Link>
              <Link to="/" className="hover:text-yellow-400 transition">
                Albums
              </Link>
              <Link to="/support" className="hover:text-yellow-400 transition">
                Contact
              </Link>
            </div>
            {/* Button */}
            <div className="hidden md:flex">
              {/* <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition">
                Login
              </button> */}
              {user ? (
                <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition">
                  Logout
                </button>
              ) : (
                <>
                 <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:opacity-90 transition">
                  Login
                </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Premium</h1>
        <p className="text-gray-400 mb-10 text-center max-w-xl">
          Listen to unlimited music without advertisements with Gana11 Premium.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Monthly Plan */}
          <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-80">
            <h2 className="text-xl font-semibold mb-2">
              Monthly{" "}
              <span className="text-gray-500 font-normal">billed monthly</span>
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Our monthly plan grants access to all premium features for
              short-term listeners.
            </p>
            <p className="text-3xl font-bold mb-6">
              $39 <span className="text-gray-500 text-lg">/mo</span>
            </p>
            <button className="w-full bg-black text-white py-3 rounded-md hover:opacity-90 transition">
              Subscribe
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="bg-gradient-to-br from-orange-300 to-yellow-400 rounded-xl shadow-lg p-8 w-full md:w-80 relative">
            <span className="absolute top-4 right-4 bg-white text-sm px-2 py-1 rounded-full font-semibold shadow">
              Most popular
            </span>
            <h2 className="text-xl font-semibold mb-2">
              Yearly{" "}
              <span className="text-gray-700 font-normal">
                billed yearly ($179)
              </span>
            </h2>
            <p className="text-gray-700 text-sm mb-6">
              Our most popular plan is valued at $299 and is now only
              $14.92/month. Save over 62% compared to the monthly plan.
            </p>
            <p className="text-3xl font-bold mb-6">
              $14.92 <span className="text-gray-700 text-lg">/mo</span>
            </p>
            <button className="w-full bg-black text-white py-3 rounded-md hover:opacity-90 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};
