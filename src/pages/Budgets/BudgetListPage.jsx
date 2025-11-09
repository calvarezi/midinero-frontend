import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { getBudgets, deleteBudget } from "../../api/budgetService";
import api from "../../api/axiosConfig";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Loader from "../../components/ui/Loader";
import { 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Filter,
  Calendar
} from "lucide-react";

const BudgetListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const { data, isLoading, isError } = useQuery(
    ["budgets", selectedMonth],
    async () => {
      const response = await api.get("/api/finances/budgets/");
      return response.data.data || response.data;
    }
  );

  const deleteMutation = useMutation(
    async (id) => {
      await api.delete(`/api/finances/budgets/${id}/`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("budgets");
      },
    }
  );

  const handleDelete = (id, categoryName) => {
    if (window.confirm(`¿Eliminar presupuesto de ${categoryName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "red";
    if (percentage >= 80) return "yellow";
    return "green";
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 100) return <AlertTriangle size={16} />;
    if (percentage >= 80) return <TrendingUp size={16} />;
    return <CheckCircle size={16} />;
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return "Superado";
    if (percentage >= 80) return "Advertencia";
    return "Saludable";
  };

  if (isLoading) return <Loader fullscreen text="Cargando presupuestos..." />;

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error al cargar presupuestos</h3>
          <p className="text-sm">Intenta nuevamente más tarde</p>
        </div>
      </div>
    );
  }

  const budgets = Array.isArray(data) ? data : [];
  const filteredBudgets = budgets.filter(
    (budget) => budget.month && budget.month.startsWith(selectedMonth)
  );

  const totalBudget = filteredBudgets.reduce(
    (sum, b) => sum + parseFloat(b.limit_amount || 0),
    0
  );
  const totalSpent = filteredBudgets.reduce(
    (sum, b) => sum + parseFloat(b.spent_amount || 0),
    0
  );
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Presupuestos
          </h1>
          <p className="text-gray-600 mt-2">
            Controla tus gastos mensuales por categoría
          </p>
        </div>
        <button
          onClick={() => navigate("/budgets/new")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-md"
        >
          <Plus size={20} />
          Nuevo Presupuesto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Presupuesto Total</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalBudget)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Gastado</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalSpent)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Disponible</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalBudget - totalSpent)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Progreso General</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">
              {overallProgress.toFixed(1)}%
            </div>
            {getStatusIcon(overallProgress)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Presupuestos Mensuales
          </h2>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {filteredBudgets.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No hay presupuestos para este mes
            </h3>
            <p className="text-gray-500 mb-4">
              Crea tu primer presupuesto para comenzar a controlar tus gastos
            </p>
            <button
              onClick={() => navigate("/budgets/new")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              <Plus size={18} />
              Crear Presupuesto
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBudgets.map((budget) => {
              const progress = budget.progress_percentage || 0;
              const statusColor = getStatusColor(progress);
              const statusIcon = getStatusIcon(progress);
              const statusText = getStatusText(progress);

              const colorClasses = {
                green: {
                  bg: "bg-green-50",
                  border: "border-green-200",
                  text: "text-green-700",
                  bar: "bg-green-500",
                },
                yellow: {
                  bg: "bg-yellow-50",
                  border: "border-yellow-200",
                  text: "text-yellow-700",
                  bar: "bg-yellow-500",
                },
                red: {
                  bg: "bg-red-50",
                  border: "border-red-200",
                  text: "text-red-700",
                  bar: "bg-red-500",
                },
              };

              const colors = colorClasses[statusColor];

              return (
                <div
                  key={budget.id}
                  className={`border ${colors.border} ${colors.bg} rounded-lg p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {budget.category_name || "Categoría"}
                        </h3>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${colors.text}`}
                        >
                          {statusIcon}
                          {statusText}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Mes: {formatDate(budget.month)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/budgets/${budget.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(budget.id, budget.category_name)
                        }
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Eliminar"
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Límite</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatCurrency(budget.limit_amount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Gastado</div>
                      <div className="text-sm font-semibold text-red-600">
                        {formatCurrency(budget.spent_amount || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Disponible</div>
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(
                          parseFloat(budget.limit_amount) -
                            parseFloat(budget.spent_amount || 0)
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Progreso</span>
                      <span className={`font-semibold ${colors.text}`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors.bar} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {budget.notify_when_exceeded && (
                    <div className="mt-2 text-xs text-gray-500">
                      Notificaciones activas
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetListPage;