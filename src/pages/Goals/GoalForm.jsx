import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getGoalById, createGoal, updateGoal } from "../../api/goalService";
import { formatCurrency } from "../../utils/formatters";
import Loader from "../../components/ui/Loader";
import { ArrowLeft, Save, Target, DollarSign, Calendar, TrendingUp } from "lucide-react";

const GoalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    target_amount: "",
    current_amount: "0",
  });

  const [errors, setErrors] = useState({});

  // Cargar datos si estamos editando
  const { data: goalData, isLoading: loadingGoal } = useQuery(
    ["goal", id],
    () => getGoalById(id),
    { 
      enabled: isEditing,
      onSuccess: (data) => {
        setFormData({
          name: data.name || "",
          month: data.month ? data.month.slice(0, 7) : new Date().toISOString().slice(0, 7),
          target_amount: data.target_amount || "",
          current_amount: data.current_amount || "0",
        });
      }
    }
  );

  // Mutación para crear/actualizar
  const mutation = useMutation(
    async (data) => {
      // ✅ FIX: Preparar datos correctamente antes de enviar
      const submitData = {
        name: data.name.trim(),
        month: `${data.month}-01`, // Convertir YYYY-MM a YYYY-MM-01
        target_amount: parseFloat(data.target_amount),
        current_amount: parseFloat(data.current_amount || 0),
      };

      console.log("Enviando datos:", submitData); // Debug

      if (isEditing) {
        return await updateGoal(id, submitData);
      } else {
        return await createGoal(submitData);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("goals");
        navigate("/goals");
      },
      onError: (error) => {
        console.error("Error en mutación:", error);
        const errorData = error.response?.data?.errors || {};
        setErrors(errorData);
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validación en el frontend antes de enviar
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = ["El nombre de la meta es requerido"];
    }

    if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      validationErrors.target_amount = ["El monto objetivo debe ser mayor a 0"];
    }

    if (!formData.month) {
      validationErrors.month = ["La fecha objetivo es requerida"];
    }

    // Si hay errores, mostrarlos y no enviar
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    mutation.mutate(formData);
  };

  if (loadingGoal) {
    return <Loader fullscreen text="Cargando meta..." />;
  }

  // Calcular progreso si estamos editando
  const progress = isEditing && formData.target_amount > 0
    ? (parseFloat(formData.current_amount || 0) / parseFloat(formData.target_amount)) * 100
    : 0;

  const remaining = isEditing
    ? parseFloat(formData.target_amount || 0) - parseFloat(formData.current_amount || 0)
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/goals")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver a metas</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          {isEditing ? "Editar Meta" : "Crear Nueva Meta"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing
            ? "Actualiza los detalles de tu meta de ahorro"
            : "Define un objetivo financiero y comienza a ahorrar"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Nombre de la meta */}
        <div>
          <label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <Target size={16} />
            Nombre de la Meta
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
              errors.name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Ej: Vacaciones, Auto nuevo, Fondo de emergencia"
            maxLength={100}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.name.length}/100 caracteres
          </p>
        </div>

        {/* Monto objetivo */}
        <div>
          <label
            htmlFor="target_amount"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <DollarSign size={16} />
            Monto Objetivo
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              id="target_amount"
              name="target_amount"
              value={formData.target_amount}
              onChange={handleChange}
              className={`w-full border rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.target_amount ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="0"
              step="1000"
              min="0"
            />
          </div>
          {formData.target_amount && parseFloat(formData.target_amount) > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Meta: {formatCurrency(formData.target_amount)}
            </p>
          )}
          {errors.target_amount && (
            <p className="text-red-600 text-sm mt-1">{errors.target_amount[0]}</p>
          )}
        </div>

        {/* Monto ahorrado actual (solo si está editando) */}
        {isEditing && (
          <div>
            <label
              htmlFor="current_amount"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
            >
              <TrendingUp size={16} />
              Monto Ahorrado Actualmente
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                type="number"
                id="current_amount"
                name="current_amount"
                value={formData.current_amount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="0"
                step="1000"
                min="0"
              />
            </div>
            {formData.current_amount && parseFloat(formData.current_amount) > 0 && (
              <p className="text-sm text-green-600 mt-1">
                Ahorrado: {formatCurrency(formData.current_amount)}
              </p>
            )}
            {errors.current_amount && (
              <p className="text-red-600 text-sm mt-1">{errors.current_amount[0]}</p>
            )}
          </div>
        )}

        {/* Fecha objetivo */}
        <div>
          <label
            htmlFor="month"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <Calendar size={16} />
            Fecha Objetivo
          </label>
          <input
            type="month"
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 7)}
            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
              errors.month ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.month && (
            <p className="text-red-600 text-sm mt-1">{errors.month[0]}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Selecciona el mes en el que planeas alcanzar tu meta
          </p>
        </div>

        {/* Resumen visual (solo si estamos editando) */}
        {isEditing && formData.target_amount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">
              Resumen del Progreso
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Progreso:</span>
                <span className="font-bold text-blue-600">{progress.toFixed(1)}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Ahorrado</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(formData.current_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Falta</p>
                  <p className="font-semibold text-orange-600">
                    {formatCurrency(Math.max(remaining, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información importante */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            💡 Consejos para tu meta
          </h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Establece un monto realista y alcanzable</li>
            <li>Divide la meta en ahorros mensuales pequeños</li>
            <li>Revisa tu progreso regularmente</li>
            <li>Ajusta la meta si es necesario</li>
          </ul>
        </div>

        {/* Errores generales */}
        {Object.keys(errors).length > 0 && 
         !errors.name && 
         !errors.target_amount && 
         !errors.month &&
         !errors.current_amount && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              {errors.detail || errors.non_field_errors?.[0] || "Error al guardar la meta"}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/goals")}
            className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? "Actualizar Meta" : "Crear Meta"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;