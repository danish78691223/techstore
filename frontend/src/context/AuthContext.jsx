import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const C = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("tech_token")) return setLoading(false);
    api
      .get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem("tech_token"))
      .finally(() => setLoading(false));
  }, []);
  const login = async (d) => {
    const r = await api.post("/auth/login", d);
    localStorage.setItem("tech_token", r.data.token);
    setUser(r.data.user);
    return r.data;
  };
  const register = async (d) => {
    const r = await api.post("/auth/register", d);
    localStorage.setItem("tech_token", r.data.token);
    setUser(r.data.user);
    return r.data;
  };
  const logout = () => {
    localStorage.removeItem("tech_token");
    setUser(null);
  };
  return (
    <C.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </C.Provider>
  );
}
export const useAuth = () => useContext(C);
