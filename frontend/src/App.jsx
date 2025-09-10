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
      <div className="flex flex-col gap-4 p-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse w-3/4"></div>
        <div className="h-8 bg-gray-700 rounded animate-pulse w-1/2"></div>
        <div className="h-8 bg-gray-700 rounded animate-pulse w-full"></div>
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
      <Route path="/artist/:id" element={< ArtistSongs/>} />

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
