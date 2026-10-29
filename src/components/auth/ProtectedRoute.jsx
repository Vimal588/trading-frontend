import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
export default function ProtectedRoute() {
  const jwt = useSelector((state) => state.auth?.jwt);

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}