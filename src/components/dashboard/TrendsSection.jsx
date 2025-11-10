import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

/**
 * TrendsSection
 * Visualiza tendencias mensuales con gráfico de línea interactivo.
 * 
 * @param {Array} trends - Array de tendencias con {month, total_income, total_expense, balance}
 */
const TrendsSection = ({ trends = [] }) => {
  const safeTrends = useMemo(
    () => (Array.isArray(trends) ? trends : trends?.results || []),
    [trends]
  );

  // No data guard
  if (!safeTrends.length)
    return (
      <div className="p-6 bg-white rounded-xl shadow text-gray-500">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800">Tendencias Mensuales</h2>
        </div>
        <p>📊 No hay datos de tendencias disponibles aún.</p>
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={24} className="text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">Tendencias Mensuales</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={safeTrends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#fff",
              border: "2px solid #4f46e5",
              borderRadius: "8px",
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Line 
            type="monotone" 
            dataKey="total_income" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
            name="Ingresos"
          />
          <Line 
            type="monotone" 
            dataKey="total_expense" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: "#ef4444", r: 4 }}
            activeDot={{ r: 6 }}
            name="Gastos"
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(TrendsSection);
