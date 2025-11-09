import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoalById, createGoal, updateGoal } from "../../api/goalService"; // Servicios de creación y edición
import { toast } from "react-toastify"; // Usado para mostrar notificaciones

const GoalForm = () => {
  const { id } = useParams(); // Obtener el ID si es un formulario de edición
  const navigate = useNavigate();

  const [goal, setGoal] = useState({
    name: "",
    description: "",
    targetAmount: "",
    savedAmount: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar los datos del objetivo si estamos en el modo de edición
  useEffect(() => {
    if (id) {
      const fetchGoal = async () => {
        try {
          setLoading(true);
          const data = await getGoalById(id);
          setGoal({
            name: data.name,
            description: data.description,
            targetAmount: data.targetAmount,
            savedAmount: data.savedAmount,
            dueDate: new Date(data.dueDate).toISOString().split("T")[0], // Formato de fecha
          });
        } catch (error) {
          setError("Error al cargar los detalles del objetivo.");
        } finally {
          setLoading(false);
        }
      };
      fetchGoal();
    }
  }, [id]);

  // Manejadores de cambio de campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal((prevGoal) => ({
      ...prevGoal,
      [name]: value,
    }));
  };

  // Validación del formulario
  const validateForm = () => {
    if (!goal.name || !goal.description || !goal.targetAmount || !goal.dueDate) {
      toast.error("Todos los campos son requeridos.");
      return false;
    }
    if (isNaN(goal.targetAmount) || goal.targetAmount <= 0) {
      toast.error("El monto objetivo debe ser un número positivo.");
      return false;
    }
    return true;
  };

  // Enviar el formulario (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (id) {
        // Editar objetivo existente
        await updateGoal(id, goal);
        toast.success("Objetivo actualizado con éxito.");
        navigate(`/goals/${id}`);
      } else {
        // Crear un nuevo objetivo
        await createGoal(goal);
        toast.success("Objetivo creado con éxito.");
        navigate("/goals");
      }
    } catch (error) {
      setError("Hubo un error al guardar el objetivo.");
      toast.error("Hubo un error al guardar el objetivo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-800">{id ? "Editar Objetivo" : "Crear Objetivo"}</h1>

      {error && <div className="text-red-600 mt-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Objetivo</label>
          <input
            type="text"
            name="name"
            value={goal.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ejemplo: Ahorro para un coche"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={goal.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Una descripción breve del objetivo"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto Objetivo</label>
          <input
            type="number"
            name="targetAmount"
            value={goal.targetAmount}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ejemplo: 1000"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monto Ahorrado</label>
          <input
            type="number"
            name="savedAmount"
            value={goal.savedAmount}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ejemplo: 500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Límite</label>
          <input
            type="date"
            name="dueDate"
            value={goal.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            disabled={loading}
          >
            {id ? "Actualizar Objetivo" : "Crear Objetivo"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/goals")}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
