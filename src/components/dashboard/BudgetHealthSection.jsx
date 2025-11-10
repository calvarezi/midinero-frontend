import React, { useMemo } from "react";
import { AlertCircle, TrendingUp, DollarSign } from "lucide-react";

/**
 * BudgetHealthSection
 * Muestra el estado y progreso del presupuesto con cálculos memoizados.
 */
const BudgetHealthSection = ({ budget }) => {
  // Si no hay datos, mostramos mensaje amigable
  if (!budget || Object.keys(budget).length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl shadow text-gray-600 flex items-center gap-2">
        <AlertCircle size={18} className="text-yellow-500" />
        No hay datos de presupuesto disponibles.
      </div>
    );
  }

  // 🔹 Cálculos memoizados
  const {
    current,
    target,
    remaining,
    progressPercent,
    isHealthy,
    status,
    statusColor,
    barColor,
  } = useMemo(() => {
    const current = Number(budget.current_amount || 0);
    const target = Number(budget.target_amount || 0);
    const remaining = target - current;
    const progressPercent = target > 0 ? (current / target) * 100 : 0;
    const isHealthy = remaining >= 0;

    return {
      current,
      target,
      remaining,
      progressPercent: Math.min(progressPercent, 100),
      isHealthy,
      status: isHealthy ? "En buena salud" : "En riesgo",
      statusColor: isHealthy
        ? "text-green-600 bg-green-50"
        : "text-red-600 bg-red-50",
      barColor: isHealthy ? "bg-green-500" : "bg-red-500",
    };
  }, [budget]);

  // 🔹 Formateador de moneda
  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);

  // 🔹 Render
  return (
    <div className="p-4 bg-white rounded-xl shadow border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Salud del Presupuesto
        </h2>
        <DollarSign size={20} className="text-blue-600" />
      </div>

      {/* Estado del presupuesto */}
      <div
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${statusColor}`}
      >
        {status}
      </div>

      {/* Monto actual y objetivo */}
      <p className="text-sm text-gray-600 mb-3">
        Gastado:{" "}
        <span className="font-bold text-gray-800">{formatCurrency(current)}</span>{" "}
        de{" "}
        <span className="font-bold text-gray-800">{formatCurrency(target)}</span>
      </p>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <TrendingUp size={12} />
          {progressPercent.toFixed(1)}% del presupuesto utilizado
        </p>
      </div>

      {/* Monto restante o excedido */}
      {remaining !== 0 && (
        <p className="text-xs mt-2 text-gray-600">
          {isHealthy ? "Disponible: " : "Excedido: "}
          <span
            className={
              isHealthy
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {formatCurrency(Math.abs(remaining))}
          </span>
        </p>
      )}
    </div>
  );
};

export default React.memo(BudgetHealthSection);
