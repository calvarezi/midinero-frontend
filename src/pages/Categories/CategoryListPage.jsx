import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories, deleteCategory } from "../../api/categoryService";
import { Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener las categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        toast.error("Error al cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Manejar la eliminación de una categoría
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      await deleteCategory.remove(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast.success("Categoría eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      toast.error("No se pudo eliminar la categoría.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-6">
        Cargando categorías...
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Lista de Categorías
        </h1>
        <Link
          to="/categories/new"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Nueva Categoría
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay categorías registradas.
        </div>
      ) : (
        <table className="w-full table-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Nombre
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Descripción
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id || category.name}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4 text-gray-800">{category.name}</td>
                <td className="py-2 px-4 text-gray-600">
                  {category.description || "Sin descripción"}
                </td>
                <td className="py-2 px-4 flex items-center gap-3">
                  <Link
                    to={`/categories/${category.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryListPage;
