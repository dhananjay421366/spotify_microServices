import axios from "axios";
import toast from "react-hot-toast";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const server = `https://spotify-user-heqq.onrender.com`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // store all users
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Register
  const HandleRegister = useCallback(async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(
        `${server}/api/v1/users/register`,
        { username, email, password },
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Failed to register");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const HandleLogin = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(
        `${server}/api/v1/users/login`,
        { email, password },
        { withCredentials: true }
      );
      if (data?.user) setUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Failed to login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const HandleLogout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.get(`${server}/api/v1/users/logout`, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/sign-in");
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Failed to logout");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ✅ Fetch all users
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/v1/users/all`, { withCredentials: true });
      if (data?.users) setUsers(data.users);
      return data.users;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      users,
      getAllUsers,  // expose to frontend
      loading,
      error,
      HandleRegister,
      HandleLogin,
      HandleLogout,
    }),
    [user, users, loading, error, HandleRegister, HandleLogin, HandleLogout, getAllUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
