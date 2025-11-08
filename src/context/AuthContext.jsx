// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";  // Solo se usa dentro del router
import { useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("access_token")
  );

  const navigate = useNavigate();  // Solo funciona dentro del Router

  useEffect(() => {
    // Si no hay token en sessionStorage, redirige al login
    if (!sessionStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const login = (access, refresh, user) => {
    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);
    if (user) sessionStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
