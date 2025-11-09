import axios from "axios";
import api from "./axiosConfig";


// Obtener todos los objetivos
export const getGoals = async () => {
  const response = await api.get("/api/finances/goals/");
  console.log("Goals fetched:", response.data);
  return response.data;
};

// Eliminar un objetivo
export const deleteGoal = async (id) => {
  const response = await api.delete(`/api/goals/${id}/`);
  return response.data;
};

// Obtener un objetivo por ID
export const getGoalById = async (id) => {
  const response = await api.get(`/api/goals/${id}/`);
  return response.data;
};

// Crear un nuevo objetivo
export const createGoal = async (goalData) => {
    const response = await api.post("/api/goals/", goalData);
    return response.data;
};

// Actualizar un objetivo existente
export const updateGoal = async (id, goalData) => {
  const response = await api.put(`/api/goals/${id}/`, goalData);
  return response.data;
};