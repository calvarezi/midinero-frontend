import { useState, useEffect } from "react";
import { getDashboardData, getPrediction } from "../api/dashboardService";

const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
        setError("Error al obtener los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPrediction = async () => {
      try {
        const predictionData = await getPrediction();
        setPrediction(predictionData.data || predictionData);
      } catch (err) {
        console.error("Error al obtener predicción:", err);
        setPredictionError("No se pudo obtener la predicción de gastos.");
      }
    };

    fetchData();
    fetchPrediction();
  }, []);

  return { data, prediction, loading, error, predictionError };
};

export default useDashboardData;
