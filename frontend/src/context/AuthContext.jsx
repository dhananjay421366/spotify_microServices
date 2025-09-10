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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ start as true for initial check
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Verify logged-in user on refresh
  const verifyUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/v1/users/me`, {
        withCredentials: true,
      });
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
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

        const userData = data.data?.user;
        if (userData) {
          setUser(userData);
          toast.success("🎉 Logged in successfully");
          navigate("/");
        }
        return data;
      } catch (err) {
        setError(err);
        toast.error(err.response?.data?.message || "Failed to login");
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
      await axios.get(`${server}/api/v1/users/logout`, {
        withCredentials: true,
      });
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/sign-in");
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/users/all`, {
          withCredentials: true,
        });
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    getAllUsers(); // ✅ call on mount
  }, []); // empty dependency = run only once

  // ✅ Memoized context value
  const value = useMemo(
    () => ({
      user,
      setUser,
      users,
      loading,
      error,
      HandleRegister,
      HandleLogin,
      HandleLogout,
      setLoading,
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
      verifyUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
