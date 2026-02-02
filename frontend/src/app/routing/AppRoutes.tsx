import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "../../pages/DashboardPage";
import { DataSourcesListPage } from "../../pages/data-sources/DataSourcesListPage";
import { DataSourceNewPage } from "../../pages/data-sources/DataSourceNewPage";
import { DataSourceEditPage } from "../../pages/data-sources/DataSourceEditPage";
import { DataViewsPage } from "../../pages/DataViewsPage";
import { AutomationRulesPage } from "../../pages/AutomationRulesPage";
import { ExecutionsPage } from "../../pages/ExecutionsPage";
import { ReportsPage } from "../../pages/ReportsPage";
import { TemplatesPage } from "../../pages/TemplatesPage";
import { AuditLogsPage } from "../../pages/AuditLogsPage";
import { SettingsPage } from "../../pages/SettingsPage";

/**
 * Route definitions. Each sidebar item maps to a route.
 * Default route goes to Dashboard.
 * TODO: Add lazy loading, 404 page.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/data-sources" element={<DataSourcesListPage />} />
      <Route path="/data-sources/new" element={<DataSourceNewPage />} />
      <Route path="/data-sources/:id/edit" element={<DataSourceEditPage />} />
      <Route path="/data-views" element={<DataViewsPage />} />
      <Route path="/automation-rules" element={<AutomationRulesPage />} />
      <Route path="/executions" element={<ExecutionsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/audit-logs" element={<AuditLogsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
