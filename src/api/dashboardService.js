import api from "./axiosConfig";

/**
 * Obtiene todos los datos principales del dashboard financiero.
 * Incluye presupuesto, categorías, resumen general y tendencias.
 */
export const getDashboardData = async () => {
  try {
    const [
      budgetRes,
      categoriesRes,
      overviewRes,
      trendsRes,
    ] = await Promise.all([
      api.get("/api/finances/budgets/"),
      api.get("/api/finances/categories/"),
      api.get("/api/finances/dashboard/overview/"),
      api.get("/api/finances/dashboard/trends/"),
    ]);

    // 🔹 Normalización de datos
    const normalizeArray = (data) => {
      if (Array.isArray(data)) return data;
      if (data?.results && Array.isArray(data.results)) return data.results;
      return [];
    };
   
    const normalizeObject = (data) => {
      if (data && typeof data === "object") return data;
      return {};
    };

    return {
      budget: normalizeObject(budgetRes.data),
      categories: normalizeArray(categoriesRes.data),
      overview: normalizeObject(overviewRes.data),
      trends: normalizeArray(trendsRes.data),
     };

  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    throw new Error("Error al obtener los datos del dashboard.");
  }
};

/**
 * Obtiene las predicciones de gastos o ingresos del sistema.
 */
export const getPrediction = async () => {
  try {
    const response = await api.get("/api/finances/dashboard/prediction/");

    if (response?.data) {
      return response.data.data || response.data.results || response.data;
    }

    return null;
  } catch (error) {
    console.error("❌ Error fetching prediction:", error);
    throw new Error("Error al obtener la predicción financiera.");
  }
};


