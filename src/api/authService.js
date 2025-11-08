import { redirect } from "react-router-dom";
import api from "./axiosConfig";

/**
 * Autenticación del usuario
 * @param {Object} credentials { username, password }
 */
export const login = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login/", { username, password });
    const { access, refresh, user } = response.data;

    if (access) sessionStorage.setItem("access_token", access);
    if (refresh) sessionStorage.setItem("refresh_token", refresh);
    if (user) sessionStorage.setItem("user", JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error.response?.data || { detail: "Error al iniciar sesión" };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error.response?.data || { detail: "Error al registrar usuario" };
  }
};

export const refreshToken = async () => {
  const refresh = sessionStorage.getItem("refresh_token");
  if (!refresh) return null;

  try {
    const response = await api.post("/api/auth/token/refresh/", { refresh });
    sessionStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Error al refrescar token:", error);
    logout();
    throw error;
  }
};

export const logout = () => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
};
