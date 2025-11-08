import api from "./axiosConfig";

export const getDashboardOverview = async () => {
  const response = await api.get("api/finances/dashboard/overview/");
  return response.data;
};

export const getBudgetHealth = async () => {
  const response = await api.get("api/finances/dashboard/budget-health/");
  return response.data;
};

export const getTrends = async () => {
  const response = await api.get("api/finances/dashboard/trends/");
  return response.data;
};
