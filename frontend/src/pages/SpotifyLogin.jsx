// // src/pages/SpotifyLogin.jsx
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import Confetti from "react-confetti";
// import { useAuth } from "../context/AuthContext";
// import { Link } from "react-router-dom";

// export const SpotifyLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showConfetti, setShowConfetti] = useState(false);

//   const { HandleLogin, loading } = useAuth();

//   const handleLogin = async () => {
//     if (!email || !password) {
//       toast.error("Please enter email and password!");
//       return;
//     }

//     try {
//       const data = await HandleLogin(email, password);
//       if (data?.data.user) {
//         setShowConfetti(true);
//         setEmail("");
//         setPassword("");
//         setTimeout(() => setShowConfetti(false), 3000);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative">
//       <Toaster position="top-right" />
//       {showConfetti && <Confetti />}
//       <div className="max-w-md w-full space-y-6 p-8 bg-gray-900 rounded-2xl shadow-lg">
//         <h1 className="text-3xl font-bold text-center text-green-500 animate-pulse">
//           Welcome Back!
//         </h1>

//         <div className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//           />
//         </div>

//         <button
//           onClick={handleLogin}
//           className={`w-full py-2 rounded font-semibold text-black 
//             ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600 transition"
//             }
//           `}
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p className="text-center text-gray-400">
//           Don't have an account?{" "}
//           <Link to="/sign-up">
//             <span className="text-green-500 underline cursor-pointer hover:text-green-400 transition">
//               Sign up
//             </span>
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "react-confetti";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const SpotifyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const { HandleLogin, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please enter email and password!");

    try {
      const data = await HandleLogin(email, password);
      if (data.data?.user) {
        setShowConfetti(true); setEmail(""); setPassword("");
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (err) {
      if (err.response?.data?.error?.includes("Email not verified")) toast.error("Email not verified. Check inbox!");
      else toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}
      <div className="max-w-md w-full space-y-6 p-8 bg-gray-900 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-green-500 animate-pulse">Welcome Back!</h1>
        <div className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <button onClick={handleLogin} disabled={loading} className={`w-full py-2 rounded font-semibold text-black ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-400 mt-2">
          <Link to="/forgot-password" className="text-green-500 underline hover:text-green-400">Forgot password?</Link>
        </p>
        <p className="text-center text-gray-400">
          Don't have an account? <Link to="/sign-up" className="text-green-500 underline hover:text-green-400">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
