import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { AppLayout } from "../layouts/AppLayout";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { TransactionsPage } from "../features/transactions/pages/TransactionsPage";
import { WalletsPage } from "../features/wallets/pages/WalletsPage";
import { CategoriesPage } from "../features/categories/pages/CategoriesPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="wallets" element={<WalletsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
