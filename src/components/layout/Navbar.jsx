import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Bell, User, Settings, LogOut, Menu, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { getNotifications } from "../../api/notificationService";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { handleLogout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // ✅ FIX: Agregadas las referencias que faltaban
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Obtener notificaciones del backend
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

  // ✅ FIX: Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FIX: Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setShowMobileMenu(false);
  }, [window.location.pathname]);

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotifications(false);
    setShowMobileMenu(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
    setShowUserMenu(false);
    setShowNotifications(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              MiDinero
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/transactions" label="Transacciones" />
            <NavLink to="/budgets" label="Presupuestos" />
            <NavLink to="/goals" label="Metas" />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Notificaciones"
                aria-expanded={showNotifications}
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {unreadCount} nueva{unreadCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No hay notificaciones</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notif.unread ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className="text-sm text-gray-800 mb-1">{notif.message}</p>
                          <span className="text-xs text-gray-500">{notif.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-3 text-center border-t border-gray-200 bg-gray-50">
                      <Link
                        to="/notifications"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        onClick={() => setShowNotifications(false)}
                      >
                        Ver todas las notificaciones
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menú de usuario"
                aria-expanded={showUserMenu}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-32 truncate">
                  {user?.username || "Usuario"}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <p className="font-semibold text-gray-800 truncate">
                      {user?.username || "Usuario"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                  </div>
                  
                  <div className="py-2">
                    <MenuLink 
                      to="/profile" 
                      label="Mi Perfil" 
                      icon={<User size={16} />}
                      onClick={() => setShowUserMenu(false)}
                    />
                    <MenuLink 
                      to="/settings" 
                      label="Configuración" 
                      icon={<Settings size={16} />}
                      onClick={() => setShowUserMenu(false)}
                    />
                  </div>
                  
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={16} className="text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menú móvil"
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-1">
              <MobileNavLink to="/dashboard" label="Dashboard" onClick={toggleMobileMenu} />
              <MobileNavLink to="/transactions" label="Transacciones" onClick={toggleMobileMenu} />
              <MobileNavLink to="/budgets" label="Presupuestos" onClick={toggleMobileMenu} />
              <MobileNavLink to="/goals" label="Metas" onClick={toggleMobileMenu} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ✅ Desktop Navigation Link Component
const NavLink = ({ to, label }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        }`
      }
    >
      {label}
    </RouterNavLink>
  );
};

// ✅ Mobile Navigation Link Component
const MobileNavLink = ({ to, label, onClick }) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
          isActive
            ? "text-blue-600 bg-blue-50"
            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
        }`
      }
    >
      {label}
    </RouterNavLink>
  );
};

// ✅ Menu Link Component (for dropdowns)
const MenuLink = ({ to, label, icon, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-600">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;