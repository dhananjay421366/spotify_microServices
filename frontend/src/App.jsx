// // App.jsx
// import { useEffect, useState } from "react";
// import { Navigate, Route, Routes } from "react-router-dom";
// import { Home } from "./pages/Home";
// import { Layout } from "./components/Layout";
// import { AlbumPage } from "./pages/AlbumPage";
// import { SpotifySignup } from "./pages/SpotifySignIn";
// import { SpotifyLogin } from "./pages/SpotifyLogin";
// import axios from "axios";
// import { Dashboard } from "./Admin/Dashboard";

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Call backend API when app loads
//   useEffect(() => {
//     const verifyUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/users/me", {
//           withCredentials: true, // important if using cookies
//         });
//         console.log("res is ", res);
//         setUser(res.data.user);
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyUser();
//   }, []);

//   if (loading) {
//     return <div className="text-white">Checking session...</div>;
//   }

//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/sign-up" element={<SpotifySignup />} />
//       <Route path="/sign-in" element={<SpotifyLogin />} />
//       <Route path="/admin/dashboard" element={<Dashboard />} />

//       {/* Protected routes wrapped with Layout */}
//       <Route element={<Layout />}>
//         <Route
//           path="/"
//           index
//           element={user ? <Home /> : <Navigate to="/sign-in" replace />}
//         />
//         <Route
//           path="album/:id"
//           element={user ? <AlbumPage /> : <Navigate to="/sign-in" replace />}
//         />
//       </Route>
//     </Routes>
//   );
// }

// export default App;
// App.jsx
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { AlbumPage } from "./pages/AlbumPage";
import { SpotifySignup } from "./pages/SpotifySignIn";
import { SpotifyLogin } from "./pages/SpotifyLogin";
import axios from "axios";
import { Dashboard } from "./Admin/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify user session on app load
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/users/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  if (loading) {
    return <div className="text-white">Checking session...</div>;
  }

  // Helper component for admin route protection
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

      {/* Protected routes wrapped with Layout */}
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
