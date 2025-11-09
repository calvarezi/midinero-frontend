import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { login as apiLogin, register as apiRegister } from "../api/authService";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  const { login, logout } = context;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiLogin(username, password);
      login(data.access, data.refresh, data.user);
      return data;
    } catch (err) {
      const errorMessage = err.detail || "Error al iniciar sesión";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRegister(userData);
      return response;
    } catch (err) {
      const errorMessage = err.detail || "Error al registrar usuario";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    handleLogin, 
    handleRegister, 
    handleLogout,
    setError 
  };
};