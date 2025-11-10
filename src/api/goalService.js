import api from "./axiosConfig";

/**
 * Servicio para gestión de metas/objetivos financieros
 * 
 * Funciones disponibles:
 * - getGoals: Obtiene lista de metas
 * - getGoalById: Obtiene una meta específica
 * - createGoal: Crea una nueva meta
 * - updateGoal: Actualiza una meta existente
 * - deleteGoal: Elimina una meta
 * - updateGoalProgress: Actualiza el progreso de una meta (si el backend lo soporta)
 */

const BASE_URL = "/api/finances/goals/";

/**
 * Obtener todas las metas del usuario
 * @param {Object} filters - Filtros opcionales (month, achieved, etc.)
 * @returns {Promise<Array>} Lista de metas
 */
export const getGoals = async (filters = {}) => {
  try {
    const response = await api.get(BASE_URL, { params: filters });
    
    // Manejo flexible de respuesta del backend
    const data = response.data.data || response.data.results || response.data;
    
    if (!Array.isArray(data)) {
      console.warn("getGoals: respuesta no es un array, devolviendo array vacío", data);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener metas:", error);
    throw error;
  }
};

/**
 * Obtener una meta específica por ID
 * @param {number|string} id - ID de la meta
 * @returns {Promise<Object>} Datos de la meta
 */
export const getGoalById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}${id}/`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener meta ${id}:`, error);
    throw error;
  }
};

/**
 * Crear una nueva meta financiera
 * @param {Object} goalData - Datos de la meta a crear
 * @param {string} goalData.name - Nombre de la meta
 * @param {string} goalData.month - Fecha objetivo (YYYY-MM-DD)
 * @param {number} goalData.target_amount - Monto objetivo
 * @param {number} goalData.current_amount - Monto actual ahorrado
 * @returns {Promise<Object>} Meta creada
 */
export const createGoal = async (goalData) => {
  try {
    // Validación básica
    if (!goalData.name || !goalData.target_amount || !goalData.month) {
      throw new Error("Faltan campos requeridos: name, target_amount, month");
    }

    const response = await api.post(BASE_URL, goalData);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al crear meta:", error);
    
    // Formateo de errores del backend
    const errorData = error.response?.data || {};
    throw {
      response: {
        data: {
          errors: errorData.errors || errorData,
          message: errorData.message || "Error al crear meta"
        }
      }
    };
  }
};

/**
 * Actualizar una meta existente
 * @param {number|string} id - ID de la meta
 * @param {Object} goalData - Datos a actualizar
 * @returns {Promise<Object>} Meta actualizada
 */
export const updateGoal = async (id, goalData) => {
  try {
    const response = await api.put(`${BASE_URL}${id}/`, goalData);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al actualizar meta ${id}:`, error);
    
    const errorData = error.response?.data || {};
    throw {
      response: {
        data: {
          errors: errorData.errors || errorData,
          message: errorData.message || "Error al actualizar meta"
        }
      }
    };
  }
};

/**
 * Actualizar solo el progreso/monto actual de una meta
 * @param {number|string} id - ID de la meta
 * @param {number} currentAmount - Nuevo monto ahorrado
 * @returns {Promise<Object>} Meta actualizada
 */
export const updateGoalProgress = async (id, currentAmount) => {
  try {
    const response = await api.patch(`${BASE_URL}${id}/`, {
      current_amount: currentAmount
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al actualizar progreso de meta ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar una meta
 * @param {number|string} id - ID de la meta a eliminar
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export const deleteGoal = async (id) => {
  try {
    await api.delete(`${BASE_URL}${id}/`);
    return { success: true, id };
  } catch (error) {
    console.error(`Error al eliminar meta ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener estadísticas de metas del usuario
 * @returns {Promise<Object>} Estadísticas agregadas
 */
export const getGoalsStats = async () => {
  try {
    const response = await api.get(`${BASE_URL}stats/`);
    return response.data.data || response.data;
  } catch (error) {
    // Si el endpoint no existe, calculamos manualmente
    console.warn("Endpoint de stats no disponible, calculando manualmente");
    
    const goals = await getGoals();
    
    const stats = {
      total_goals: goals.length,
      achieved_goals: goals.filter(g => g.achieved).length,
      total_target_amount: goals.reduce((sum, g) => sum + parseFloat(g.target_amount || 0), 0),
      total_current_amount: goals.reduce((sum, g) => sum + parseFloat(g.current_amount || 0), 0),
      overall_progress: 0
    };
    
    if (stats.total_target_amount > 0) {
      stats.overall_progress = (stats.total_current_amount / stats.total_target_amount) * 100;
    }
    
    return stats;
  }
};

/**
 * Marcar una meta como completada
 * @param {number|string} id - ID de la meta
 * @returns {Promise<Object>} Meta actualizada
 */
export const markGoalAsAchieved = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}${id}/`, {
      achieved: true
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al marcar meta ${id} como completada:`, error);
    throw error;
  }
};

// Exportar funciones adicionales útiles

/**
 * Calcular el progreso de una meta
 * @param {Object} goal - Objeto de la meta
 * @returns {number} Porcentaje de progreso (0-100)
 */
export const calculateProgress = (goal) => {
  if (!goal || !goal.target_amount) return 0;
  
  const target = parseFloat(goal.target_amount);
  const current = parseFloat(goal.current_amount || 0);
  
  if (target === 0) return 0;
  
  return Math.min((current / target) * 100, 100);
};

/**
 * Calcular cuánto falta para alcanzar la meta
 * @param {Object} goal - Objeto de la meta
 * @returns {number} Monto faltante
 */
export const calculateRemaining = (goal) => {
  if (!goal) return 0;
  
  const target = parseFloat(goal.target_amount || 0);
  const current = parseFloat(goal.current_amount || 0);
  
  return Math.max(target - current, 0);
};

/**
 * Validar si una meta está próxima a vencer (dentro de 30 días)
 * @param {Object} goal - Objeto de la meta
 * @returns {boolean} True si está próxima a vencer
 */
export const isGoalExpiringSoon = (goal) => {
  if (!goal || !goal.month) return false;
  
  const targetDate = new Date(goal.month);
  const today = new Date();
  const daysUntilTarget = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  
  return daysUntilTarget > 0 && daysUntilTarget <= 30;
};

/**
 * Validar si una meta está vencida
 * @param {Object} goal - Objeto de la meta
 * @returns {boolean} True si está vencida
 */
export const isGoalOverdue = (goal) => {
  if (!goal || !goal.month || goal.achieved) return false;
  
  const targetDate = new Date(goal.month);
  const today = new Date();
  
  return targetDate < today;
};