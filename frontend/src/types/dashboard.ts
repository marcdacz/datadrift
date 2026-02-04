/**
 * Dashboard domain types: visualisations, reports, and execution logs.
 */

export type VisualisationType = "table" | "pie" | "bar" | "line" | "text";

export interface DashboardVisualisationPosition {
  x: number;
  y: number;
}

export interface DashboardVisualisationSize {
  w: number;
  h: number;
}

export interface DashboardVisualisation {
  id: string;
  title: string;
  /**
   * Type of visualisation (table, chart, text, etc.).
   */
  type: VisualisationType;
  /**
   * Optional backing data view identifier.
   */
  dataViewId?: string;
  /**
   * Grid position on the dashboard.
   */
  position: DashboardVisualisationPosition;
  /**
   * Grid size on the dashboard.
   */
  size: DashboardVisualisationSize;
  /**
   * Optional error description when the visualisation cannot be rendered
   * (e.g. invalid or deleted data view).
   */
  errorMessage?: string | null;
}

export interface ReportSummary {
  id: string;
  name: string;
  description?: string;
  author: string;
  /**
   * ISO8601 timestamp string.
   */
  createdAt: string;
  downloadUrl?: string;
}

export type ExecutionStatus = "success" | "failed" | "pending";

export interface ExecutionLogEntry {
  id: string;
  executedAt: string;
  automationName: string;
  status: ExecutionStatus;
  errorSummary?: string | null;
  errorDetails?: string | null;
}

