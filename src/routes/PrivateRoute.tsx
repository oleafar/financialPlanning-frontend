import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession";

export function PrivateRoute() {
  const session = useAuthSession();
  const location = useLocation();

  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
