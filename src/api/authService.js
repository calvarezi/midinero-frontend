import api from "./axiosConfig";

export const login = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login/", { 
      username, 
      password 
    });

    const access = response.data.access;
    const refresh = response.data.refresh;

    if (!access || !refresh) {
      throw new Error("Respuesta de login inválida");
    }

    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);

    try {
      const profileResponse = await api.get("/api/auth/profile/");
      const user = profileResponse.data.data;
      sessionStorage.setItem("user", JSON.stringify(user));
      
      return { access, refresh, user };
    } catch (profileError) {
      console.warn("No se pudo obtener perfil del usuario:", profileError);
      return { access, refresh, user: null };
    }
  } catch (error) {
    console.error("Error en login:", error);
    const errorMessage = error.response?.data?.detail 
      || error.response?.data?.message 
      || "Error al iniciar sesión";
    throw { detail: errorMessage };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    const errors = error.response?.data?.errors || {};
    const errorMessage = error.response?.data?.message 
      || "Error al registrar usuario";
    throw { detail: errorMessage, errors };
  }
};

export const refreshToken = async () => {
  const refresh = sessionStorage.getItem("refresh_token");
  if (!refresh) {
    throw new Error("No hay refresh token disponible");
  }

  try {
    const response = await api.post("/api/auth/refresh/", { refresh });
    const newAccessToken = response.data.access;
    sessionStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error al refrescar token:", error);
    logout();
    throw error;
  }
};

export const logout = async () => {
  const refresh = sessionStorage.getItem("refresh_token");
  
  if (refresh) {
    try {
      await api.post("/api/auth/logout/", { refresh });
    } catch (error) {
      console.warn("Error al cerrar sesión en el servidor:", error);
    }
  }

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("user");
};

export const getProfile = async () => {
  try {
    const response = await api.get("/api/auth/profile/");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};