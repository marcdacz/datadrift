import { clearAuthState, loadInitialAuthState } from "./authStorage";

interface RequestOptions extends RequestInit {
  /**
   * When true, 401/403 responses will trigger client-side auth clearing.
   * Use for requests that require a valid authenticated session.
   */
  authProtected?: boolean;
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestOptions): Promise<Response> {
  const { authProtected, headers, ...rest } = init ?? {};

  const baseHeaders: HeadersInit = {
    Accept: "application/json",
  };

  const existing = loadInitialAuthState();
  if (existing.accessToken) {
    baseHeaders.Authorization = `Bearer ${existing.accessToken}`;
  }

  const mergedHeaders: HeadersInit = {
    ...baseHeaders,
    ...(headers ?? {}),
  };

  const response = await fetch(input, {
    ...rest,
    headers: mergedHeaders,
  });

  if (authProtected && (response.status === 401 || response.status === 403)) {
    clearAuthState();
  }

  return response;
}

