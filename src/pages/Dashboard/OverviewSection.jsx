import { formatCurrency } from "../../utils/formatters";
import Loader from "../../components/ui/Loader";

export default function OverviewSection({ data, loading }) {
  if (loading) return <Loader />;

  const {
    total_income = 0,
    total_expense = 0,
    balance = 0,
    saving_rate = 0,
    budget_usage = 0,
  } = data || {};

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Resumen General</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Ingresos</div>
          <div className="text-2xl font-bold text-green-600">
            ${formatCurrency(total_income)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Gastos</div>
          <div className="text-2xl font-bold text-red-600">
            ${formatCurrency(total_expense)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Balance</div>
          <div className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
            ${formatCurrency(balance)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Tasa de Ahorro</div>
          <div className="text-2xl font-bold text-purple-600">
            {saving_rate}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Uso del Presupuesto</div>
          <div className="text-2xl font-bold text-orange-500">
            {budget_usage}%
          </div>
        </div>
      </div>
    </section>
  );
}
