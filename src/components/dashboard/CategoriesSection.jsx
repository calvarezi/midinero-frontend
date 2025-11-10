import React, { useMemo } from "react";
import { Tag, AlertCircle } from "lucide-react";

/**
 * CategoriesSection
 * Visualiza las categorías de transacciones disponibles.
 * 
 * @param {Array} categories - Array de categorías con {id, name, type, description}
 */
const CategoriesSection = ({ categories = [] }) => {
  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories : categories?.results || []),
    [categories]
  );

  // No data guard
  if (!safeCategories.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-gray-500">
        <div className="flex items-center gap-2 mb-2">
          <Tag size={20} className="text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-800">Categorías</h2>
        </div>
        <p>📌 No hay categorías registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Tag size={24} className="text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">Categorías ({safeCategories.length})</h2>
      </div>
      <ul className="space-y-3">
        {safeCategories.map((category) => (
          <li
            key={category.id || category.name}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-transparent rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-gray-800 font-semibold">{category.name}</span>
              {category.type && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  category.type === 'income' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {category.type === 'income' ? '📈 Ingreso' : '📉 Gasto'}
                </span>
              )}
            </div>
            {category.description && (
              <span className="text-xs text-gray-500 italic">{category.description}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(CategoriesSection);
