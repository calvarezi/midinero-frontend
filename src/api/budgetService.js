import api from "./axiosConfig";

/**
 * Servicio para gestión de presupuestos y categorías
 * 
 * Funciones disponibles:
 * - getBudgets: Obtiene lista de presupuestos
 * - getBudgetById: Obtiene un presupuesto específico
 * - createBudget: Crea un nuevo presupuesto
 * - updateBudget: Actualiza un presupuesto existente
 * - deleteBudget: Elimina un presupuesto
 * - getCategories: Obtiene lista de categorías
 * - getBudgetHealth: Obtiene estado de salud de presupuestos
 */

export const getBudgets = async (month = null) => {
  try {
    const params = month ? { month } : {};
    const response = await api.get("/api/finances/budgets/", { params });
    
    const data = response.data.data || response.data.results || response.data;
    
    if (!Array.isArray(data)) {
      console.warn("getBudgets: respuesta no es un array, devolviendo array vacío", data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    throw error;
  }
};

export const getBudgetById = async (id) => {
  try {
    const response = await api.get(`/api/finances/budgets/${id}/`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener presupuesto ${id}:`, error);
    throw error;
  }
};

export const createBudget = async (budgetData) => {
  try {
    const response = await api.post("/api/finances/budgets/", budgetData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al crear presupuesto:", error);
    const errorData = error.response?.data || {};
    throw {
      response: {
        data: {
          errors: errorData.errors || errorData,
          message: errorData.message || "Error al crear presupuesto"
        }
      }
    };
  }
};

export const updateBudget = async (id, budgetData) => {
  try {
    const response = await api.put(`/api/finances/budgets/${id}/`, budgetData);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al actualizar presupuesto ${id}:`, error);
    const errorData = error.response?.data || {};
    throw {
      response: {
        data: {
          errors: errorData.errors || errorData,
          message: errorData.message || "Error al actualizar presupuesto"
        }
      }
    };
  }
};

export const deleteBudget = async (id) => {
  try {
    await api.delete(`/api/finances/budgets/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error al eliminar presupuesto ${id}:`, error);
    throw error;
  }
};

export const getCategories = async (type = null) => {
  try {
    const params = type ? { type } : {};
    const response = await api.get("/api/finances/categories/", { params });
    
    const data = response.data.data || response.data.results || response.data;
    
    if (!Array.isArray(data)) {
      console.warn("getCategories: respuesta no es un array, devolviendo array vacío", data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
};

export const getBudgetHealth = async (month = null) => {
  try {
    const params = month ? { month } : {};
    const response = await api.get("/api/finances/dashboard/budget-health/", { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener salud de presupuestos:", error);
    throw error;
  }
};