// src/App.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./Admin/Dashboard";
import { AllAlbum } from "./components/AllAlbums";
import ArtistSongs from "./components/ArtistSongs";
import { Layout } from "./components/Layout";
import { PremiumPage } from "./components/Premium";
import Support from "./components/Support";
import { useAuth } from "./context/AuthContext";
import { AlbumPage } from "./pages/AlbumPage";
import { Home } from "./pages/Home";
import { SpotifyLogin } from "./pages/SpotifyLogin";
import { SpotifySignup } from "./pages/SpotifySignIn";
import LinkedInOpenAnimation from "./components/Animation/Animation1";
import { ResetPassword } from "./components/Resetpassword";
import { ForgotPassword } from "./components/ForgotPassword";

function App() {
  const { user, setUser } = useAuth();
  const server = `https://spotify-user-g9xg.onrender.com`;
  // const server = `http://localhost:8000`;
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // ✅ Verify session
    const verifyUser = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/users/me`, {
          withCredentials: true,
        });
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setChecking(false); // done checking
      }
    };
    verifyUser();
  }, []);

  // ✅ Skeleton screen while checking session
  if (checking) {
    return (
      <div className="container flex flex-col items-center justify-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Circle logo icon */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 shadow-lg shadow-blue-400/40 animate-pulse">
            <span className="text-white font-extrabold text-lg">G</span>
          </div>
          {/* Gradient Text Logo */}
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
            Gana11
          </h1>
        </div>

        {/* Loader line */}
        <div className="line mt-6 w-full">
          <div className="inner"></div>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/sign-in" replace />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!user) return <Navigate to="/sign-in" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/sign-up" element={<SpotifySignup />} />
      <Route path="/sign-in" element={<SpotifyLogin />} />
      <Route path="/premium" element={<PremiumPage />} />
      <Route path="/support" element={<Support />} />
      <Route path="/albums" element={<AllAlbum />} />
      <Route path="/artist/:id" element={<ArtistSongs />} />
      <Route path="/animation" element={<LinkedInOpenAnimation />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin protected route */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route
          path="/"
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="album/:id"
          element={
            <ProtectedRoute>
              <AlbumPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
