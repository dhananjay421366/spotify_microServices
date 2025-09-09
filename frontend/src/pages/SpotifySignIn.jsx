import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "react-confetti";
import { useAuth } from "../context/AuthContext"; // make sure path is correct
import { Link, useNavigate } from "react-router-dom";

export const SpotifySignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const { HandleRegister, loading } = useAuth();
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (!username || !email || !password) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      const data = await HandleRegister(username, email, password);
      if (data) {
        toast.success("🎆 You have signed up successfully!");
        setShowConfetti(true);

        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");

        setTimeout(() => setShowConfetti(false), 3000);
        navigate("/sign-in")
      }
    } catch (err) {
      // Error is already handled inside HandleRegister with toast
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}
      <div className="max-w-md w-full space-y-6 p-8 bg-gray-900 rounded-2xl shadow-lg animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-green-500 animate-pulse">
          Sign Up
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        <button
          onClick={handleSignup}
          className={`w-full py-2 rounded font-semibold text-black 
            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 transition"}
          `}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/sign-in">
          <span className="text-green-500 underline cursor-pointer hover:text-green-400 transition">
            Log in
          </span>
          </Link>
        </p>
      </div>
    </div>
  );
};
