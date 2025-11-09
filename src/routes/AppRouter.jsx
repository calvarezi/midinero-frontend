import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import LoginPage from "../pages/Auth/LoginPage";
import BudgetListPage from "../pages/Budgets/BudgetListPage";
import BudgetForm from "../pages/Budgets/BudgetForm";
import BudgetDetails from "../pages/Budgets/BudgetDetails";
import ProtectedRoute from "../components/ProtectedRoute";
import GoalListPage from "../pages/Goals/GoalListPage"; // Página de metas
import GoalForm from "../pages/Goals/GoalForm"; // Formulario de metas
import GoalDetails from "../pages/Goals/GoalDetails"; // Detalles de metas
import TransactionListPage from "../pages/Transactions/TransactionListPage"; // Página de transacciones
import CategoryListPage from "../pages/Categories/CategoryListPage"; // Página de categorías
import CategoryForm from "../pages/Categories/CategoryForm"; // Formulario de categorías


export default function AppRouter() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Ruta principal de dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Rutas de presupuestos */}
        <Route path="budgets">
          <Route index element={<BudgetListPage />} />
          <Route path="new" element={<BudgetForm />} />
          <Route path=":id" element={<BudgetDetails />} />
          <Route path=":id/edit" element={<BudgetForm />} />
        </Route>

        {/* Rutas de metas */}
        <Route path="goals">
          <Route index element={<GoalListPage />} />
          <Route path="new" element={<GoalForm />} />
          <Route path=":id" element={<GoalDetails />} />
          <Route path=":id/edit" element={<GoalForm />} />
        </Route>

        {/* Rutas de transacciones */}
        <Route path="transactions" element={<TransactionListPage />} />

        {/* Rutas de categorías */}
        <Route path="categories" element={<CategoryListPage />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />

        {/* Rutas para goals */}
        <Route path="goals">
          <Route index element={<GoalListPage />} />
          <Route path="new" element={<GoalForm />} />
          <Route path=":id" element={<GoalDetails />} />
          <Route path=":id/edit" element={<GoalForm />} />
        </Route>

      </Route>

      {/* Ruta para redirigir en caso de una página no encontrada */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
