import React from "react";
import { ChevronLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Header Component
 * 
 * Componente de encabezado reutilizable para páginas internas.
 * Incluye título, breadcrumbs, botón de regreso y acciones personalizadas.
 * 
 * Props:
 * - title: Título principal de la página
 * - subtitle: Subtítulo o descripción opcional
 * - showBack: Muestra botón de regreso (default: false)
 * - backTo: Ruta a la que regresar (default: -1)
 * - actions: Array de elementos JSX para acciones (botones, etc)
 * - breadcrumbs: Array de objetos {label, path} para navegación
 */

export default function Header({
  title,
  subtitle,
  showBack = false,
  backTo,
  actions = [],
  breadcrumbs = [],
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                {crumb.path ? (
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="hover:text-blue-600 transition"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-700">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBack && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Regresar"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
            )}

            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Info size={14} />
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {actions.length > 0 && (
            <div className="flex items-center space-x-3">
              {actions.map((action, index) => (
                <React.Fragment key={index}>{action}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}