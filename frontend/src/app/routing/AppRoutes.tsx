import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "../../pages/DashboardPage";
import { DataSourcesListPage } from "../../pages/data-sources/DataSourcesListPage";
import { DataSourceNewPage } from "../../pages/data-sources/DataSourceNewPage";
import { DataSourceEditPage } from "../../pages/data-sources/DataSourceEditPage";
import { LoginPage } from "../../pages/auth/LoginPage";
import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";

/**
 * Route definitions.
 * - `/login` is public.
 * - All other routes require authentication.
 * - Settings and certain sections are further gated by role.
 * TODO: Add lazy loading, 404 page.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={(
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        )}
      />
      <Route
        path="/data-sources"
        element={(
          <RequireAuth>
            <RequireRole allowedRoles={["admin"]}>
              <DataSourcesListPage />
            </RequireRole>
          </RequireAuth>
        )}
      />
      <Route
        path="/data-sources/new"
        element={(
          <RequireAuth>
            <RequireRole allowedRoles={["admin"]}>
              <DataSourceNewPage />
            </RequireRole>
          </RequireAuth>
        )}
      />
      <Route
        path="/data-sources/:id/edit"
        element={(
          <RequireAuth>
            <RequireRole allowedRoles={["admin"]}>
              <DataSourceEditPage />
            </RequireRole>
          </RequireAuth>
        )}
      />
      <Route
        path="/data-views"
        element={<Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
