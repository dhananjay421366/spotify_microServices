import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const { HandleForgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await HandleForgotPassword(email);
      if (data?.success) {
        Swal.fire({
          icon: "success",
          title: "Reset Link Sent",
          text: data.message || "Check your email for the password reset link.",
          confirmButtonColor: "#22c55e",
        });
        setEmail("");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.error || "Something went wrong!",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-black to-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 bg-opacity-90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-700">
          <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">
            Forgot Password
          </h1>
          <p className="text-center text-gray-300 mb-4">
            Enter your email to receive a password reset link
          </p>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
