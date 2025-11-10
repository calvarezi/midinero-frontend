import React, { useState, useEffect } from "react";
import { getCategories } from "../../api/categoryService";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Asegurar que sea un array
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-section p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Categorías</h2>
      {categories.length === 0 ? (
        <p className="text-gray-500">No hay categorías disponibles.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-3 bg-blue-50 rounded-lg text-blue-800 font-medium text-center"
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;
