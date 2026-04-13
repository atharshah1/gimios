import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

type Role = "gym_owner" | "super_admin";

export function ProtectedRoute({
  user,
  role,
  children,
}: {
  user: { role: Role } | null;
  role: Role;
  children: ReactElement;
}) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "gym_owner" ? "/owner/dashboard" : "/admin/dashboard"} replace />;
  return children;
}
