import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, createCategory, updateCategory } from "../../api/categoryService"; // Servicios para obtener, crear y actualizar categorías

const CategoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams(); // Obtener el ID de la categoría si estamos editando
  const navigate = useNavigate();

  // Si estamos editando, obtenemos la categoría desde el backend
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const category = await getCategoryById(id);
          setName(category.name);
          setDescription(category.description);
        } catch (error) {
          console.error("Error fetching category:", error);
          setError("No se pudo cargar la categoría.");
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const categoryData = { name, description };

      if (id) {
        // Si tenemos un ID, estamos actualizando una categoría
        await updateCategory(id, categoryData);
      } else {
        // Si no hay ID, estamos creando una nueva categoría
        await createCategory(categoryData);
      }

      // Redirigir al listado de categorías después de guardar
      navigate("/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      setError("Hubo un error al guardar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        {id ? "Editar Categoría" : "Crear Nueva Categoría"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Nombre de la categoría */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre de la Categoría
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Descripción de la categoría */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="4"
            required
          />
        </div>

        {/* Botón de envío */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-block w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          >
            {loading ? "Guardando..." : id ? "Actualizar Categoría" : "Crear Categoría"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
