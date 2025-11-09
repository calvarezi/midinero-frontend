import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGoalById, deleteGoal } from "../../api/goalService"; // Servicios para obtener y eliminar objetivos

const GoalDetails = () => {
  const { id } = useParams(); // Obtener el ID del objetivo desde la URL
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener los detalles del objetivo cuando el componente se monta
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const data = await getGoalById(id); // Llamamos al servicio para obtener los datos
        setGoal(data);
      } catch (error) {
        console.error("Error fetching goal:", error);
        setError("No se pudo cargar el objetivo.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  // Eliminar el objetivo
  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este objetivo?")) {
      try {
        await deleteGoal(id); // Llamamos al servicio para eliminar el objetivo
        navigate("/goals"); // Redirigir al listado de objetivos después de eliminar
      } catch (error) {
        console.error("Error deleting goal:", error);
        setError("Hubo un error al eliminar el objetivo.");
      }
    }
  };

  // Si estamos cargando o hay un error, mostramos un mensaje de carga o error
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-800">Detalles del Objetivo</h1>

      <div className="mt-6">
        <div className="mb-4">
          <span className="font-medium text-gray-700">Nombre:</span>
          <p className="text-lg text-gray-900">{goal.name}</p>
        </div>

        <div className="mb-4">
          <span className="font-medium text-gray-700">Descripción:</span>
          <p className="text-sm text-gray-700">{goal.description}</p>
        </div>

        <div className="mb-4">
          <span className="font-medium text-gray-700">Monto Objetivo:</span>
          <p className="text-lg text-gray-900">${goal.targetAmount.toFixed(2)}</p>
        </div>

        <div className="mb-4">
          <span className="font-medium text-gray-700">Monto Ahorrado:</span>
          <p className="text-lg text-gray-900">${goal.savedAmount.toFixed(2)}</p>
        </div>

        <div className="mb-4">
          <span className="font-medium text-gray-700">Fecha Límite:</span>
          <p className="text-lg text-gray-900">{new Date(goal.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-4 mt-6">
        <Link
          to={`/goals/${goal.id}/edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Editar Objetivo
        </Link>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
        >
          Eliminar Objetivo
        </button>
      </div>
    </div>
  );
};

export default GoalDetails;
