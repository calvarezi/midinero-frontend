import axios from "axios";

const API_URL = "/api/categories"; // URL de tu API para categorías

// Obtener todas las categorías
export const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Obtener una categoría por ID
export const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Crear una nueva categoría
export const createCategory = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData);
  return response.data;
};

// Actualizar una categoría existente
export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(`${API_URL}/${id}`, categoryData);
  return response.data;
};

// Eliminar una categoria
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
