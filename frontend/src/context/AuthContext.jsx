import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("teachme_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("teachme_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("teachme_user", JSON.stringify(data.user));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem("teachme_token");
        localStorage.removeItem("teachme_user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const persistSession = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("teachme_token", payload.token);
    localStorage.setItem("teachme_user", JSON.stringify(payload.user));
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data);
    return data.user;
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("teachme_token");
    localStorage.removeItem("teachme_user");
  };

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(token && user), login, register, logout, setSession: persistSession }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
