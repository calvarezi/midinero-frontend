import { NavLink } from "react-router-dom";
import { 
  BarChart2, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Settings, 
  Bell,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: <BarChart2 size={20} />,
      description: "Vista general"
    },
    { 
      path: "/transactions", 
      label: "Transacciones", 
      icon: <CreditCard size={20} />,
      description: "Ingresos y gastos"
    },
    { 
      path: "/budgets", 
      label: "Presupuestos", 
      icon: <DollarSign size={20} />,
      description: "Control de gastos"
    },
    { 
      path: "/goals", 
      label: "Metas", 
      icon: <Target size={20} />,
      description: "Objetivos financieros"
    },
    { 
      path: "/reports", 
      label: "Reportes", 
      icon: <TrendingUp size={20} />,
      description: "Análisis y estadísticas"
    },
  ];

  const bottomNavItems = [
    { 
      path: "/notifications", 
      label: "Notificaciones", 
      icon: <Bell size={20} />
    },
    { 
      path: "/settings", 
      label: "Configuración", 
      icon: <Settings size={20} />
    },
  ];

  return (
    <aside 
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold">MiDinero</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {!collapsed && user && (
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.username || "Usuario"}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-800 text-gray-300 hover:text-white"
              }`
            }
            title={collapsed ? item.label : ""}
          >
            {({ isActive }) => (
              <>
                <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-300">
                      {item.description}
                    </div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-700">
        <div className="p-4 space-y-1">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-gray-800 text-white" 
                    : "hover:bg-gray-800 text-gray-400"
                }`
              }
              title={collapsed ? item.label : ""}
            >
              {item.icon}
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="p-4">
          <button
            onClick={logout}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-colors`}
            title={collapsed ? "Cerrar sesión" : ""}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;