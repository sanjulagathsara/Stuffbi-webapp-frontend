/* eslint-disable react-refresh/only-export-components */


import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // --------------------------------
  // Define logout FIRST
  // --------------------------------
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    api
      .get("/profile/me")
      .then((res) => setUser(res.data))
      .catch(() => logout()); // now logout is declared above
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    setUser(res.data.user);
  };

  const signup = async (email, password) => {
    const res = await api.post("/auth/register", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout ,signup}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
