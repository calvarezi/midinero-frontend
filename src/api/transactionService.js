import api from './axiosConfig';  // Importa la instancia global de axios


// Obtener todas las transacciones
export const getTransactions = async () => {
  try {
    const response = await api.get("/api/finances/transactions/");
    console.log("Fetched transactions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;  // Lanza el error para que lo maneje el componente o quien lo llame
  }
};

// Eliminar una transacción
export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`/api/finances/transactions/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting transaction with id ${id}:`, error);
    throw error;
  }
};

// Obtener una transacción por ID
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`/api/finances/transactions/${id}/`);
  } catch (error) {
    console.error(`Error fetching transaction with id ${id}:`, error);
    throw error;
  }
};

// Crear una nueva transacción
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post("/api/finances/transactions/", transactionData);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Actualizar una transacción existente
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(`/api/finances/transactions/${id}/`, transactionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction with id ${id}:`, error);
    throw error;
  }
};
