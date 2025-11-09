import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGoals, deleteGoal } from "../../api/goalService"; // Servicios de obtención y eliminación
import { toast } from "react-toastify"; // Usado para mostrar notificaciones
import { Trash, Edit } from "lucide-react"; // Íconos de eliminación y edición

const GoalListPage = () => {
  const [goals, setGoals] = useState([]);  // Inicializamos como un array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener los objetivos del backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const data = await getGoals();

        // Si la respuesta es un array, se asume que es una lista de objetivos.
        // Si es un objeto (como el que mostraste), lo convertimos en un array.
        setGoals(Array.isArray(data) ? data : [data]); // Aseguramos que sea un array.
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError("Error al obtener los objetivos.");
        toast.error("Hubo un error al obtener los objetivos.");
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este objetivo?")) {
      try {
        await deleteGoal(id);
        setGoals(goals.filter((goal) => goal.id !== id)); // Eliminar de la lista
        toast.success("Objetivo eliminado correctamente.");
      } catch (err) {
        console.error("Error deleting goal:", err);
        toast.error("Error al eliminar el objetivo.");
      }
    }
  };

  if (loading) return <div>Cargando objetivos...</div>;

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-800">Lista de Objetivos</h1>

      {error && <div className="text-red-600 mt-4">{error}</div>}

      <div className="mt-6">
        <Link
          to="/goals/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none mb-4 inline-block"
        >
          Crear Nuevo Objetivo
        </Link>

        {goals.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="text-left bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Monto Objetivo</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Monto Ahorrado</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Fecha Límite</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-800">{goal.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{goal.target_amount}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{goal.current_amount}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{new Date(goal.month).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 flex space-x-2">
                    <Link
                      to={`/goals/${goal.id}/edit`}
                      className="text-blue-600 hover:text-blue-700"
                      aria-label="Editar"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Eliminar"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 mt-4">No hay objetivos registrados.</div>
        )}
      </div>
    </div>
  );
};

export default GoalListPage;
