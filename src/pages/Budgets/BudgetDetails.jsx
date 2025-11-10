import React from "react";
import { useQuery } from "react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBudgetById } from "../../api/budgetService";
import api from "../../api/axiosConfig";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Loader from "../../components/ui/Loader";
import {
  ArrowLeft,
  Edit,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Receipt,
} from "lucide-react";

const BudgetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const { data: budget, isLoading, isError } = useQuery(
  ["budget", id],
  () => getBudgetById(id)
);

  const { data: transactions } = useQuery(
    ["budget-transactions", id, budget?.category, budget?.month],
    async () => {
      if (!budget) return [];
      
      const monthStart = new Date(budget.month);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const response = await api.get("/api/finances/transactions/", {
        params: {
          category: budget.category,
          date_after: monthStart.toISOString().split("T")[0],
          date_before: monthEnd.toISOString().split("T")[0],
        },
      });
      return response.data.data || response.data.results || [];
    },
    { enabled: !!budget }
  );

  if (isLoading) return <Loader fullscreen text="Cargando detalles..." />;

  if (isError || !budget) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error al cargar presupuesto</h3>
          <p className="text-sm">El presupuesto no existe o fue eliminado</p>
          <button
            onClick={() => navigate("/budgets")}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Volver a presupuestos
          </button>
        </div>
      </div>
    );
  }

  const progress = budget.progress_percentage || 0;
  const spent = budget.spent_amount || 0;
  const limit = budget.limit_amount || 0;
  const remaining = limit - spent;
  const isOverBudget = progress >= 100;
  const isWarning = progress >= 80 && progress < 100;

  const statusConfig = {
    overBudget: {
      icon: <AlertCircle size={24} />,
      text: "Presupuesto Superado",
      color: "red",
      bg: "bg-red-50",
      border: "border-red-200",
      textColor: "text-red-700",
    },
    warning: {
      icon: <TrendingDown size={24} />,
      text: "Advertencia",
      color: "yellow",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      textColor: "text-yellow-700",
    },
    healthy: {
      icon: <CheckCircle size={24} />,
      text: "Saludable",
      color: "green",
      bg: "bg-green-50",
      border: "border-green-200",
      textColor: "text-green-700",
    },
  };

  const status = isOverBudget
    ? statusConfig.overBudget
    : isWarning
    ? statusConfig.warning
    : statusConfig.healthy;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/budgets")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span>Volver a presupuestos</span>
        </button>

        <button
          onClick={() => navigate(`/budgets/${id}/edit`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Edit size={18} />
          Editar
        </button>
      </div>

      <div className={`${status.bg} border ${status.border} rounded-lg p-6`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {budget.category_name || "Presupuesto"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{formatDate(budget.month, "long")}</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${status.textColor}`}>
            {status.icon}
            <span className="font-semibold">{status.text}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <DollarSign size={16} />
              Límite del presupuesto
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(limit)}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <TrendingDown size={16} />
              Total gastado
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(spent)}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <CheckCircle size={16} />
              Disponible
            </div>
            <div
              className={`text-2xl font-bold ${
                remaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(Math.max(remaining, 0))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Progreso del presupuesto</span>
            <span className={`font-bold ${status.textColor}`}>
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isOverBudget
                  ? "bg-red-500"
                  : isWarning
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {budget.notify_when_exceeded && (
          <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Notificaciones activas para este presupuesto</span>
          </div>
        )}
      </div>

      {isOverBudget && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">
            Has superado tu presupuesto
          </h3>
          <p className="text-sm text-red-700">
            Has gastado {formatCurrency(spent - limit)} más del límite establecido.
            Considera ajustar tus gastos o revisar el presupuesto.
          </p>
        </div>
      )}

      {isWarning && !isOverBudget && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Advertencia de presupuesto
          </h3>
          <p className="text-sm text-yellow-700">
            Has usado más del 80% de tu presupuesto. Te quedan{" "}
            {formatCurrency(remaining)} disponibles.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Receipt size={20} />
            Transacciones del mes
          </h2>
          <Link
            to="/transactions"
            className="text-sm text-blue-600 hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Receipt size={48} className="mx-auto mb-2 text-gray-400" />
            <p>No hay transacciones registradas para este presupuesto</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {transaction.description || "Sin descripción"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    -{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}

            {transactions.length > 10 && (
              <div className="text-center pt-4">
                <Link
                  to="/transactions"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver {transactions.length - 10} transacciones más
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetDetails;