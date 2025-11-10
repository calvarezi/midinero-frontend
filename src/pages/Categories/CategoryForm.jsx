import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "../../api/categoryService";

const CategoryForm = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar datos si estamos editando una categoría
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const category = await getCategoryById(id);
        setFormData({
          name: category.name || "",
          description: category.description || "",
        });
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("No se pudo cargar la categoría.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { ...formData };

      if (id) {
        await updateCategory(id, payload);
      } else {
        await createCategory(payload);
      }

      navigate("/categories");
    } catch (err) {
      console.error("Error saving category:", err);
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

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        {/* Campo: Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de la Categoría
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ej. Alimentación, Transporte..."
          />
        </div>

        {/* Campo: Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Describe brevemente la categoría..."
          />
        </div>

        {/* Mensaje de error */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Guardando..."
            : id
            ? "Actualizar Categoría"
            : "Crear Categoría"}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
