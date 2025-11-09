import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/categoryService"; // Servicio para obtener las categorías (puedes ajustarlo)

const CategoriesSections = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories(); // Llamada al servicio para obtener categorías
        setCategories(response);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las categorías.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="categories-section">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Categorías</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded-lg shadow-lg hover:bg-blue-50 transition"
          >
            <Link to={`/categories/${category.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-700">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSections;
