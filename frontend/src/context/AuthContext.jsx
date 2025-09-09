// src/context/AuthContext.jsx
import axios from "axios";
import toast from "react-hot-toast";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const server = `https://spotify-user-g9xg.onrender.com`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // store all users
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Verify session on app load
  const verifyUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/v1/users/me`, {
        withCredentials: true,
      });
      if (data?.user) setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // ✅ Register
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

  // ✅ Login
  const HandleLogin = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.post(
          `${server}/api/v1/users/login`,
          { email, password },
          { withCredentials: true }
        );
        if (data?.user) {
          setUser(data.user);
          toast.success("🎉 Logged in successfully");
          navigate("/"); // redirect to home
        }
        return data;
      } catch (err) {
        setError(err);
        toast.error(err.response?.data?.message || "Failed to login");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // ✅ Logout
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
      const { data } = await axios.get(`${server}/api/v1/users/all`, {
        withCredentials: true,
      });
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
      getAllUsers,
      loading,
      error,
      HandleRegister,
      HandleLogin,
      HandleLogout,
      verifyUser,
    }),
    [
      user,
      users,
      loading,
      error,
      HandleRegister,
      HandleLogin,
      HandleLogout,
      getAllUsers,
      verifyUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
