import { NavLink } from "react-router-dom";
import { BarChart2, DollarSign, LogOut } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <BarChart2 size={18} /> },
    { path: "/budgets", label: "Presupuestos", icon: <DollarSign size={18} /> },
  ];

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-gray-700">MiDinero</div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-600" : "hover:bg-gray-700"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md"
          onClick={() => {
            sessionStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
