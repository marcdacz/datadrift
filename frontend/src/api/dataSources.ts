/**
 * Data sources API client.
 * GET/POST /api/data-sources, PUT/DELETE /api/data-sources/{id}, POST /api/data-sources/test.
 */

import type {
  CreateDataSourceRequest,
  DataSource,
  TestConnectionRequest,
  TestConnectionResponse,
} from "../types/dataSources";

const BASE = "/api/data-sources";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = text ? (JSON.parse(text) as { message?: string; error?: string }) : null;
      if (body?.message) message = body.message;
      else if (body?.error) message = body.error;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function fetchDataSources(): Promise<DataSource[]> {
  const res = await fetch(BASE, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return handleResponse<DataSource[]>(res);
}

export async function fetchDataSourceById(id: string): Promise<DataSource> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return handleResponse<DataSource>(res);
}

export async function createDataSource(
  body: CreateDataSourceRequest
): Promise<DataSource> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<DataSource>(res);
}

export async function updateDataSource(
  id: string,
  body: CreateDataSourceRequest
): Promise<DataSource> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<DataSource>(res);
}

export async function deleteDataSource(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    let message = `Delete failed: ${res.status}`;
    try {
      const body = text ? (JSON.parse(text) as { message?: string; error?: string }) : null;
      if (body?.message) message = body.message;
      else if (body?.error) message = body.error;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
}

export async function testConnection(
  body: TestConnectionRequest
): Promise<TestConnectionResponse> {
  const res = await fetch(`${BASE}/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<TestConnectionResponse>(res);
}

export async function testConnectionById(id: string): Promise<TestConnectionResponse> {
  const res = await fetch(`${BASE}/${id}/test`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  return handleResponse<TestConnectionResponse>(res);
}
