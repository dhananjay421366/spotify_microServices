// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { AlbumPage } from "./pages/AlbumPage";
import { SpotifySignup } from "./pages/SpotifySignIn";
import { SpotifyLogin } from "./pages/SpotifyLogin";
import { Dashboard } from "./Admin/Dashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white">Checking session...</div>;
  }

  // Protect admin route
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
          element={user ? <Home /> : <Navigate to="/sign-in" replace />}
        />
        <Route
          path="album/:id"
          element={user ? <AlbumPage /> : <Navigate to="/sign-in" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
