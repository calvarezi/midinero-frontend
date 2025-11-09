import api from "./axiosConfig";

export const testConnection = async () => {
  try {
    const response = await api.get("/api/health/");
    console.log("✅ Conectado con backend:", response.data);
  } catch (error) {
    console.error("❌ Error de conexión con backend:", error.message);
  }
};
