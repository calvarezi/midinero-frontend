import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { getNotifications } from "../../api/notificationService"; // Importamos el servicio

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { handleLogout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Obtener notificaciones del backend cuando el componente se monta
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      const data = await getNotifications(token);
      setNotifications(data);
      setUnreadCount(data.filter((n) => n.unread).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  fetchNotifications();
}, []);



  // Toggle de la visibilidad de los menús
  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotifications(false); // Cerrar notificaciones cuando el menú de usuario está abierto
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowUserMenu(false); // Cerrar el menú de usuario cuando las notificaciones están abiertas
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo y enlaces */}
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">MiDinero</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/transactions" label="Transacciones" />
            <NavLink to="/budgets" label="Presupuestos" />
            <NavLink to="/goals" label="Metas" />
          </div>
        </div>

        {/* Notificaciones y menú de usuario */}
        <div className="flex items-center space-x-4">
          {/* Icono de notificaciones */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
              aria-label="Notificaciones"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-blue-600">{unreadCount} nuevas</span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notif.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <span className="text-xs text-gray-500">{notif.time}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <Link
                    to="/notifications"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver todas las notificaciones
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.username || "Usuario"}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-800">
                    {user?.username || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
                <div className="py-2">
                  <NavLink to="/profile" label="Mi Perfil" icon={<User size={16} className="text-gray-600" />} />
                  <NavLink to="/settings" label="Configuración" icon={<Settings size={16} className="text-gray-600" />} />
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 transition w-full text-left"
                  >
                    <LogOut size={16} className="text-red-600" />
                    <span className="text-sm text-red-600">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, icon }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
    >
      {icon && <span className="text-gray-600">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
