import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories, deleteCategory } from "../../api/categoryService"; // Servicio para obtener y eliminar categorías
import { Trash2, Edit } from "lucide-react"; // Iconos de eliminación y edición

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener las categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Llamamos al servicio
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Manejar la eliminación de una categoría
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta categoría?");
    if (confirmDelete) {
      try {
        await deleteCategory(id); // Llamamos al servicio para eliminar la categoría
        setCategories(categories.filter((category) => category.id !== id)); // Actualizamos la lista de categorías
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-800">Lista de Categorías</h1>

      {/* Botón para agregar nueva categoría */}
      <div className="mb-4">
        <Link
          to="/categories/new"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Nueva Categoría
        </Link>
      </div>

      {/* Tabla de categorías */}
      {loading ? (
        <div className="text-center text-gray-600">Cargando categorías...</div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Nombre</th>
              <th className="py-2 px-4 border-b text-left">Descripción</th>
              <th className="py-2 px-4 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-600">
                  No hay categorías disponibles.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="py-2 px-4 border-b text-gray-800">{category.name}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{category.description}</td>
                  <td className="py-2 px-4 border-b flex items-center space-x-2">
                    <Link
                      to={`/categories/${category.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryListPage;
