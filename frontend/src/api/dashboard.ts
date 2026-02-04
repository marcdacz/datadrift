/**
 * Dashboard API client (stubbed for now).
 *
 * These functions currently return mock data so that the dashboard UI can be
 * implemented and exercised before backend endpoints exist. Replace the
 * implementations with real `/api` calls once the backend contract is ready.
 */

import type {
  DashboardVisualisation,
  ExecutionLogEntry,
  ReportSummary,
} from "@/types/dashboard";

export async function fetchDashboardVisualisations(): Promise<DashboardVisualisation[]> {
  // TODO: Wire to real backend endpoint, e.g. GET /api/dashboard/visualisations
  const mock: DashboardVisualisation[] = [
    {
      id: "vis-1",
      title: "Example table visualisation",
      type: "table",
      dataViewId: "dv-1",
      position: { x: 0, y: 0 },
      size: { w: 2, h: 2 },
    },
  ];

  return Promise.resolve(mock);
}

export async function fetchReports(): Promise<ReportSummary[]> {
  // TODO: Wire to real backend endpoint, e.g. GET /api/reports
  const mock: ReportSummary[] = [
    {
      id: "rep-1",
      name: "Monthly data quality overview",
      description: "High-level summary of key data quality metrics.",
      author: "Data Platform Team",
      createdAt: new Date().toISOString(),
      downloadUrl: "#",
    },
  ];

  return Promise.resolve(mock);
}

export async function fetchExecutionLogs(): Promise<ExecutionLogEntry[]> {
  // TODO: Wire to real backend endpoint, e.g. GET /api/executions
  const now = new Date();
  const mock: ExecutionLogEntry[] = [
    {
      id: "exec-1",
      executedAt: now.toISOString(),
      automationName: "Daily freshness checks",
      status: "success",
      errorSummary: null,
      errorDetails: null,
    },
    {
      id: "exec-2",
      executedAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
      automationName: "SLA breach notifications",
      status: "failed",
      errorSummary: "Failed to connect to reporting warehouse",
      errorDetails:
        "Connection to warehouse `analytics-prod` timed out after 30 seconds. Check network ACLs and credentials.",
    },
  ];

  return Promise.resolve(mock);
}

