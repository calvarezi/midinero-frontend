import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Zap, AlertCircle } from "lucide-react";

/**
 * PredictionSection
 * Visualiza predicciones de gastos basadas en histórico del usuario.
 * 
 * @param {Object} prediction - Datos de predicción con {total_prediction, category_predictions, trend, confidence}
 */
const PredictionSection = ({ prediction }) => {
  // Memoized data transformation
  const memoizedData = useMemo(() => {
    const { data = {} } = prediction || {};
    return {
      predicted_total: data.total_prediction || prediction?.total_prediction || 0,
      category_predictions: data.category_predictions || prediction?.category_predictions || [],
      trend: data.trend || prediction?.trend || "stable",
      trend_percentage: data.trend_percentage || prediction?.trend_percentage || 0,
      confidence: data.confidence || prediction?.confidence || "medium",
    };
  }, [prediction]);

  const { predicted_total, category_predictions, trend, trend_percentage, confidence } = memoizedData;

  const trendIcon = trend === "up" 
    ? <TrendingUp className="text-red-500" size={20} /> 
    : trend === "down" 
    ? <TrendingDown className="text-green-500" size={20} /> 
    : <Zap className="text-yellow-500" size={20} />;

  const trendLabel = trend === "up"
    ? `📈 Aumento estimado: ${trend_percentage}%`
    : trend === "down"
    ? `📉 Reducción estimada: ${Math.abs(trend_percentage)}%`
    : "⏸️ Tendencia estable";

  const confidenceColor =
    confidence === "high"
      ? "bg-green-100 text-green-700"
      : confidence === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value || 0);

  // No data guard
  if (!prediction)
    return (
      <div className="p-6 bg-white rounded-xl shadow text-gray-500">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={20} className="text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800">Predicción de Gastos</h2>
        </div>
        <p>🔮 No hay datos de predicción disponibles aún.</p>
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md border border-indigo-100 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {trendIcon}
          <h2 className="text-xl font-bold text-gray-800">Predicción de Gastos</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${confidenceColor}`}>
          Confianza: {confidence === "high" ? "Alta" : confidence === "medium" ? "Media" : "Baja"}
        </div>
      </div>

      {/* Total Predicción */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-indigo-200">
        <p className="text-sm text-gray-600 mb-1">💰 Gasto Total Proyectado</p>
        <p className="text-3xl font-bold text-indigo-600">{formatCurrency(predicted_total)}</p>
      </div>

      {/* Tendencia */}
      <div className="bg-white rounded-lg p-3 mb-4 border border-indigo-200">
        <p className="text-sm font-semibold text-gray-700">{trendLabel}</p>
      </div>

      {/* Predicciones por Categoría */}
      {category_predictions.length > 0 && (
        <div>
          <h3 className="text-md font-bold text-gray-800 mb-3">Desglose por Categoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category_predictions.map((cat, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <p className="text-sm font-semibold text-gray-700">{cat.category || "Sin nombre"}</p>
                <p className="text-lg font-bold text-indigo-600">
                  {formatCurrency(cat.predicted_amount || cat.amount || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PredictionSection);
