import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import Swal from "sweetalert2";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { HandleResetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await HandleResetPassword(token, password);
      if (data?.success) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successfully",
          text: data.message || "You can now login with your new password",
          confirmButtonColor: "#22c55e",
        });
        setPassword("");
        navigate("/sign-in");
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
          <h1 className="text-3xl font-extrabold text-center text-green-400 mb-6">
            Reset Your Password
          </h1>
          <p className="text-center text-gray-300 mb-4">
            Enter a new password to continue
          </p>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
