/**
 * Auth API client.
 *
 * NOTE:
 * - Endpoint paths are provisional and should be aligned with the backend
 *   implementation (e.g., `/api/login`, `/api/logout`, `/api/session`).
 * - In development we currently use a mock implementation of `login` so that
 *   the frontend can be exercised before the real authentication backend
 *   exists.
 *   TODO: Remove the mock branch in `login` once real authentication is implemented.
 */

import type { Role, User } from "../types/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

interface ErrorBody {
  message?: string;
  error?: string;
}

const LOGIN_URL = "/api/login";
const LOGOUT_URL = "/api/logout";
const SESSION_URL = "/api/session";

function getMockRoleFromEmail(email: string): Role {
  const normalized = email.toLowerCase();
  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("manager")) return "manager";
  return "user";
}

async function parseErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) {
    return `Request failed: ${res.status}`;
  }

  try {
    const body = JSON.parse(text) as ErrorBody;
    if (body.message) return body.message;
    if (body.error) return body.error;
  } catch {
    // Fallback to raw text when JSON parsing fails.
  }

  return text;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  // Development-only mock login so the app can be exercised without a backend.
  // Maps the email address to a role:
  // - includes "admin"    -> admin
  // - includes "manager"  -> manager
  // - otherwise           -> user
  if (import.meta.env.DEV) {
    const role = getMockRoleFromEmail(body.email);
    const mockUser: User = {
      id: `mock-${role}`,
      email: body.email,
      name: role === "user" ? "Demo User" : `Demo ${role[0].toUpperCase()}${role.slice(1)}`,
      role,
    };

    // Small delay to better approximate network latency.
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      user: mockUser,
      accessToken: `mock-token-${role}`,
    };
  }

  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message || "Login failed");
  }

  const json = (await res.json()) as LoginResponse;

  // Basic sanity check so we fail fast if the backend contract drifts.
  if (!json.user || !json.accessToken) {
    throw new Error("Invalid login response from server");
  }

  return json;
}

/**
 * Optional logout call to the backend. Frontend auth state should be cleared
 * regardless of whether this call succeeds.
 */
export async function logout(): Promise<void> {
  // Development-only: skip network logout while the backend endpoint does not
  // exist to avoid noisy 404s in the server logs.
  // TODO: Remove this guard once a real /api/logout endpoint is implemented.
  if (import.meta.env.DEV) {
    return;
  }

  try {
    const res = await fetch(LOGOUT_URL, {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      // Swallow errors but log to console for debugging.
      const message = await parseErrorMessage(res);
      // eslint-disable-next-line no-console
      console.warn("Logout request failed:", message);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Logout request error:", error);
  }
}

/**
 * Session lookup hook for future enhancements (e.g., refresh tokens, SSO).
 * Currently unused but kept as a stub to keep the API surface complete.
 */
export async function getCurrentSession(): Promise<LoginResponse | null> {
  const res = await fetch(SESSION_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (res.status === 204) {
    return null;
  }

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new Error(message || "Failed to load session");
  }

  const json = (await res.json()) as LoginResponse;
  return json;
}

