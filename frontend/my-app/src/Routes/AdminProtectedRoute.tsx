import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = { children: React.ReactNode };

const AdminProtectedRoute = ({ children }: Props) => {
  const isAdmin = localStorage.getItem("role");
  const location = useLocation();

  return isAdmin == "ADMIN" ? (
    <>{children}</>
  ) : (
    <Navigate to="/homepage" state={{ from: location }} replace />
  );
};

export default AdminProtectedRoute;
