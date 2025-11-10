import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart, Activity } from "lucide-react";
import { formatCurrency, formatPercentage } from "../../utils/formatters";
import Loader from "../ui/Loader";

/**
 * OverviewSection
 * Componente optimizado que muestra tarjetas con resumen financiero general.
 * Recibe datos como prop desde el componente padre (DashboardPage).
 * 
 * @param {Object} overview - Datos de resumen: {total_income, total_expense, balance, savings_rate, transaction_count}
 */
export default function OverviewSection({ overview }) {

  const {
    total_income = 0,
    total_expense = 0,
    balance = 0,
    savings_rate = 0,
    transaction_count = 0,
    income_count = 0,
    expense_count = 0,
  } = overview || {};

  // Memoized card definitions - ANTES del early return
  const cards = useMemo(() => [
    {
      label: "Ingresos Totales",
      value: formatCurrency(total_income),
      color: "green",
      icon: <TrendingUp className="text-green-600" size={20} />,
      subtitle: `${income_count} transacciones`,
    },
    {
      label: "Gastos Totales",
      value: formatCurrency(total_expense),
      color: "red",
      icon: <TrendingDown className="text-red-600" size={20} />,
      subtitle: `${expense_count} transacciones`,
    },
    {
      label: "Balance Neto",
      value: formatCurrency(balance),
      color: balance >= 0 ? "blue" : "red",
      icon: <DollarSign className={balance >= 0 ? "text-blue-600" : "text-red-600"} size={20} />,
      subtitle: balance >= 0 ? "✓ Positivo" : "✗ Negativo",
    },
    {
      label: "Tasa de Ahorro",
      value: formatPercentage(savings_rate),
      color: "purple",
      icon: <Target className="text-purple-600" size={20} />,
      subtitle: savings_rate >= 20 ? "📈 Excelente" : "📊 Mejorable",
    },
    {
      label: "Transacciones",
      value: transaction_count,
      color: "gray",
      icon: <Activity className="text-gray-600" size={20} />,
      subtitle: "Total registradas",
    },
  ], [total_income, total_expense, balance, savings_rate, transaction_count, income_count, expense_count]);

  const colorClasses = {
    green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200",
    red: "bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200",
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200",
    gray: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200",
  };

  // No data guard
  if (!overview) {
    return (
      <div className="p-4 bg-white rounded-xl shadow text-gray-500">
        📊 No hay datos disponibles para el resumen.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📊 Resumen General</h2>
        <span className="text-xs text-gray-400">
          Actualizado: {new Date().toLocaleTimeString("es-CO")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl border-2 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
              colorClasses[card.color]
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                {card.label}
              </span>
              <div className="p-2 bg-white rounded-lg">
                {card.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{card.value}</div>
            <div className="text-xs text-gray-600 font-medium">{card.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
