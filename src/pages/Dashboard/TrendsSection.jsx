import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig"; 

const TrendsSection = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamada a la API usando tu instancia configurada de axios
        const response = await api.get("/api/finances/dashboard/trends/");
        const data = response.data.results || response.data;

        // Aseguramos que siempre sea un array
        setTrends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching trends:", err);
        setError("Error al obtener las tendencias.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return <div className="text-gray-600">Cargando tendencias...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Tendencias</h2>

      {trends.length === 0 ? (
        <p className="text-gray-500">No hay datos de tendencias disponibles.</p>
      ) : (
        <ul className="space-y-2">
          {trends.map((trend) => (
            <li
              key={trend.id}
              className="flex justify-between items-center border-b border-gray-100 pb-1 text-sm text-gray-700"
            >
              <span>{trend.label || trend.name}</span>
              <span className="font-semibold text-blue-600">
                {trend.value || trend.amount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendsSection;
