/**
 * Data source types and API shapes.
 * Backend: DataSourceResponse (config is masked JSON string); CreateDataSourceRequest (name, type, config).
 */

export type DataSourceType = "CSV" | "JSON" | "DATABASE" | "REST";

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  /** Masked config JSON from API; secrets are never returned. */
  config: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataSourceRequest {
  name: string;
  type: DataSourceType;
  /** Full config as JSON string; secrets sent in plaintext and encrypted server-side. */
  config: string;
}

/** Per-type config shapes for the dynamic form. Secrets are write-only. */
export interface ConfigCsv {
  path?: string;
  url?: string;
  encoding?: string;
}

export interface ConfigJson {
  path?: string;
  url?: string;
  encoding?: string;
}

export interface ConfigDatabase {
  host: string;
  port?: number;
  database: string;
  username: string;
  password?: string;
}

export interface ConfigRest {
  url: string;
  apiKey?: string;
  token?: string;
  headers?: Record<string, string>;
}

export type DataSourceConfig =
  | ConfigCsv
  | ConfigJson
  | ConfigDatabase
  | ConfigRest;

/** Test connection request: same shape as create (name/type/config). */
export type TestConnectionRequest = CreateDataSourceRequest;

export interface TestConnectionResponse {
  success: boolean;
  message?: string;
}
