import type { AuthState, User } from "../types/auth";

const AUTH_STORAGE_KEY = "datadrift.auth";
const AUTH_CLEARED_EVENT = "datadrift:auth-cleared";

interface StoredAuthPayload {
  user: User;
  accessToken: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function dispatchAuthClearedEvent(): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new CustomEvent(AUTH_CLEARED_EVENT));
  } catch {
    // Ignore dispatch failures (e.g., non-browser environments).
  }
}

export function loadInitialAuthState(): AuthState {
  if (!isBrowser()) {
    return {
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
    };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return {
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,
      };
    }

    const parsed = JSON.parse(raw) as StoredAuthPayload;
    if (!parsed.user || !parsed.accessToken) {
      return {
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,
      };
    }

    return {
      user: parsed.user,
      accessToken: parsed.accessToken,
      isLoading: false,
      error: null,
    };
  } catch {
    // Corrupt or invalid JSON; clear and start from a clean slate.
    clearAuthState();
    return {
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
    };
  }
}

export function persistAuthState(user: User, accessToken: string): void {
  if (!isBrowser()) return;

  const payload: StoredAuthPayload = { user, accessToken };
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures (e.g., quota exceeded, private mode).
  }
}

export function clearAuthState(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
  dispatchAuthClearedEvent();
}

