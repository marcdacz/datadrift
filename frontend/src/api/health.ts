/**
 * Health API client. Calls backend GET /api/health.
 * TODO: Add retries, timeout, base URL from env.
 */

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
}

const HEALTH_URL = "/api/health";

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(HEALTH_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json() as Promise<HealthResponse>;
}
