import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { 
  getCategories, 
  getBudgetById, 
  createBudget, 
  updateBudget 
} from "../../api/budgetService";
import { formatCurrency } from "../../utils/formatters";
import Loader from "../../components/ui/Loader";
import { ArrowLeft, Save, DollarSign, Calendar, Tag } from "lucide-react";

const BudgetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    category: "",
    month: new Date().toISOString().slice(0, 7),
    limit_amount: "",
    notify_when_exceeded: true,
  });

  const [errors, setErrors] = useState({});

  const { data: categoriesData, isLoading: loadingCategories } = useQuery(
    "categories",
    async () => {
      const response = await api.get("/api/finances/categories/");
      const data = response.data.data || response.data.results || response.data;
      return Array.isArray(data) ? data : [];
    }
  );

  const { data: budgetData, isLoading: loadingBudget } = useQuery(
    ["budget", id],
    async () => {
      const response = await api.get(`/api/finances/budgets/${id}/`);
      return response.data.data || response.data;
    },
    { enabled: isEditing }
  );

  useEffect(() => {
    if (budgetData && isEditing) {
      setFormData({
        category: budgetData.category,
        month: budgetData.month ? budgetData.month.slice(0, 7) : new Date().toISOString().slice(0, 7),
        limit_amount: budgetData.limit_amount,
        notify_when_exceeded: budgetData.notify_when_exceeded,
      });
    }
  }, [budgetData, isEditing]);

  const mutation = useMutation(
    async (data) => {
      if (isEditing) {
        return await api.put(`/api/finances/budgets/${id}/`, data);
      } else {
        return await api.post("/api/finances/budgets/", data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("budgets");
        navigate("/budgets");
      },
      onError: (error) => {
        const errorData = error.response?.data?.errors || {};
        setErrors(errorData);
      },
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      month: `${formData.month}-01`,
      limit_amount: parseFloat(formData.limit_amount),
    };

    mutation.mutate(submitData);
  };

  if (loadingCategories || (isEditing && loadingBudget)) {
    return <Loader fullscreen text="Cargando formulario..." />;
  }

  const categories = categoriesData || [];
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/budgets")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Volver a presupuestos</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditing ? "Editar Presupuesto" : "Crear Presupuesto"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing 
            ? "Modifica los detalles de tu presupuesto mensual"
            : "Define un límite de gasto mensual para una categoría"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Tag size={16} />
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={isEditing}
          >
            <option value="">Selecciona una categoría</option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="month" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} />
            Mes
          </label>
          <input
            type="month"
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={isEditing}
          />
          {errors.month && (
            <p className="text-red-600 text-sm mt-1">{errors.month[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="limit_amount" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign size={16} />
            Límite de gasto
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              id="limit_amount"
              name="limit_amount"
              value={formData.limit_amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          {formData.limit_amount && (
            <p className="text-sm text-gray-500 mt-1">
              Límite: {formatCurrency(formData.limit_amount)}
            </p>
          )}
          {errors.limit_amount && (
            <p className="text-red-600 text-sm mt-1">{errors.limit_amount[0]}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notify_when_exceeded"
            name="notify_when_exceeded"
            checked={formData.notify_when_exceeded}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="notify_when_exceeded" className="ml-2 text-sm text-gray-700">
            Notificarme cuando se supere el presupuesto
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Información importante
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• El presupuesto se aplica a todos los gastos de la categoría seleccionada</li>
            <li>• Recibirás alertas cuando alcances el 90% y 100% del límite</li>
            <li>• Puedes modificar el límite en cualquier momento</li>
          </ul>
        </div>

        {Object.keys(errors).length > 0 && !errors.category && !errors.month && !errors.limit_amount && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              {errors.detail || errors.non_field_errors?.[0] || "Error al guardar el presupuesto"}
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/budgets")}
            className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            <Save size={18} />
            {mutation.isLoading 
              ? "Guardando..." 
              : isEditing 
              ? "Actualizar" 
              : "Crear Presupuesto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;