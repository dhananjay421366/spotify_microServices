// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { AlbumPage } from "./pages/AlbumPage";
import { SpotifySignup } from "./pages/SpotifySignIn";
import { SpotifyLogin } from "./pages/SpotifyLogin";
import { Dashboard } from "./Admin/Dashboard";
import { useAuth } from "./context/AuthContext";
import { useCallback, useEffect } from "react";
import axios from "axios";

function App() {
  const { user, loading, setUser, setLoading } = useAuth();
  const server = `https://spotify-user-g9xg.onrender.com`;

  // ✅ Verify session on app load
  const verifyUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/v1/users/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [server, setUser, setLoading]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center h-screen">
        Checking session...
      </div>
    );
  }

  // ✅ Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="text-white flex items-center justify-center h-screen">
          Checking session...
        </div>
      );
    }
    if (!user) return <Navigate to="/sign-in" replace />;
    return children;
  };

  // ✅ Admin route wrapper
  const AdminRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="text-white flex items-center justify-center h-screen">
          Checking session...
        </div>
      );
    }
    if (!user) return <Navigate to="/sign-in" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/sign-up" element={<SpotifySignup />} />
      <Route path="/sign-in" element={<SpotifyLogin />} />

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
