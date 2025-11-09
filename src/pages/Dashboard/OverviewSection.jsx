import { formatCurrency, formatPercentage } from "../../utils/formatters";
import Loader from "../../components/ui/Loader";

export default function OverviewSection({ data, loading }) {
  if (loading) return <Loader />;
  if (!data) return null;

  const {
    total_income = 0,
    total_expense = 0,
    balance = 0,
    savings_rate = 0,
    transaction_count = 0,
    income_count = 0,
    expense_count = 0,
  } = data;

  const cards = [
    {
      label: "Ingresos Totales",
      value: formatCurrency(total_income),
      color: "green",
      icon: "↑",
      subtitle: `${income_count} transacciones`,
    },
    {
      label: "Gastos Totales",
      value: formatCurrency(total_expense),
      color: "red",
      icon: "↓",
      subtitle: `${expense_count} transacciones`,
    },
    {
      label: "Balance",
      value: formatCurrency(balance),
      color: balance >= 0 ? "blue" : "red",
      icon: balance >= 0 ? "=" : "⚠",
      subtitle: balance >= 0 ? "Positivo" : "Negativo",
    },
    {
      label: "Tasa de Ahorro",
      value: formatPercentage(savings_rate),
      color: "purple",
      icon: "%",
      subtitle: savings_rate >= 20 ? "Excelente" : "Mejorable",
    },
    {
      label: "Transacciones",
      value: transaction_count,
      color: "gray",
      icon: "#",
      subtitle: "Total registradas",
    },
  ];

  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  };

  const iconColorClasses = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    gray: "text-gray-600",
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Resumen General</h2>
        <span className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleTimeString("es-CO")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border shadow-sm transition-transform hover:scale-105 ${
              colorClasses[card.color]
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium">{card.label}</span>
              <span className={`text-2xl ${iconColorClasses[card.color]}`}>
                {card.icon}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="text-xs opacity-75">{card.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
}