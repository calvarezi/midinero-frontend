import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { handleLogout } = useAuth();

  // Evita error si el usuario no está guardado
  const storedUser = sessionStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.warn("Error al parsear el usuario:", error);
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* LOGO */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-8 h-8 rounded-full border border-white"
        />
        <span className="text-lg font-semibold">MiDinero</span>
      </div>

      {/* ENLACES */}
      <ul className="hidden md:flex space-x-6">
        <li>
          <Link to="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/budgets" className="hover:text-gray-200">
            Presupuestos
          </Link>
        </li>
        <li>
          <Link to="/settings" className="hover:text-gray-200">
            Configuración
          </Link>
        </li>
      </ul>

      {/* USUARIO */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm">
              {user.username || user.email || "Usuario"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-600 font-medium px-3 py-1 rounded-md text-sm hover:bg-gray-100"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
