import React from "react";
import useDashboardData from "../../hooks/useDashboardData";
import { AlertCircle } from "lucide-react";

import BudgetHealthSection from "../../components/dashboard/BudgetHealthSection";
import CategoriesSection from "../../components/dashboard/CategoriesSection";
import OverviewSection from "../../components/dashboard/OverviewSection";
import TrendsSection from "../../components/dashboard/TrendsSection";
import PredictionSection from "../../components/dashboard/PredictionSection";

/**
 * DashboardPage
 * Página principal del dashboard que orquesta todas las secciones.
 * Utiliza el hook centralizado useDashboardData para obtener todos los datos.
 */
const DashboardPage = () => {
  const { data, prediction, loading, error } = useDashboardData();

  if (loading)
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-8 max-w-lg mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Error al cargar el dashboard</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );

  const { budget, categories, overview, trends } = data || {};

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          💰 Dashboard Financiero
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Overview Section */}
      <OverviewSection overview={overview} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Health - Takes 1 column */}
        <div className="lg:col-span-1">
          <BudgetHealthSection budget={budget} />
        </div>

        {/* Categories - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CategoriesSection categories={categories} />
        </div>
      </div>

      {/* Trends */}
      <TrendsSection trends={trends} />

      {/* Prediction */}
      <PredictionSection prediction={prediction} />
    </div>
  );
};

export default DashboardPage;
