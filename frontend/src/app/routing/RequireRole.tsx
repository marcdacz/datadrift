import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/auth";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

interface RequireRoleProps {
  allowedRoles: Role | Role[];
  children?: ReactNode;
}

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (isLoading) {
    return (
      <PlaceholderPage
        title="Loading"
        description="Checking your permissions…"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!hasRole(roles)) {
    return (
      <PlaceholderPage
        title="Not authorized"
        description="You do not have permission to access this page."
      />
    );
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
}

