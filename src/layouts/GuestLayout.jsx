import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getStoredToken } from "@/api/axios";

export default function GuestComponent() {
  const { loading } = useAuth();
  const token = getStoredToken();

  if (loading) return null;
  if (token) return <Navigate to="/" replace />;
  return <Outlet />;
}
