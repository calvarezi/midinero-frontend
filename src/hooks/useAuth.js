// src/hooks/useAuth.js
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { login as apiLogin, register } from "../api/authService";

export const useAuth = () => {
  const { login, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(username, password);
      login(data.access, data.refresh, data.user); 
    } catch (err) {
      setError(err.detail || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await register(userData);
    } catch (err) {
      setError(err.detail || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleLogin, handleRegister, logout };
};
