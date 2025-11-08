// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import LoginPage from "../pages/Auth/LoginPage";
import BudgetListPage from "../pages/Budgets/BudgetListPage";
import ProtectedRoute from "../components/ProtectedRoute"; 

export default function AppRouter() {
  const isAuthenticated = !!sessionStorage.getItem("access_token");

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="budgets" element={<BudgetListPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}
