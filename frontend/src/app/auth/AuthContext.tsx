import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthState, Role, User } from "../../types/auth";
import { loadInitialAuthState, persistAuthState, clearAuthState } from "../../lib/authStorage";
import { login as loginApi, logout as logoutApi, type LoginRequest } from "../../api/auth";

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = loadInitialAuthState();
  const [user, setUser] = useState<User | null>(initial.user);
  const [accessToken, setAccessToken] = useState<string | null>(initial.accessToken);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAuthCleared = () => {
      setUser(null);
      setAccessToken(null);
      setIsLoading(false);
      setError(null);
    };

    window.addEventListener("datadrift:auth-cleared", handleAuthCleared);
    return () => window.removeEventListener("datadrift:auth-cleared", handleAuthCleared);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: nextUser, accessToken: nextToken } = await loginApi(credentials);
      setUser(nextUser);
      setAccessToken(nextToken);
      persistAuthState(nextUser, nextToken);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      // Ensure we clear any half-baked state.
      setUser(null);
      setAccessToken(null);
      clearAuthState();
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await logoutApi();
    } finally {
      // Always clear client-side state regardless of backend response.
      setUser(null);
      setAccessToken(null);
      clearAuthState();
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback(
    (roles: Role | Role[]) => {
      if (!user) return false;
      const allowed = Array.isArray(roles) ? roles : [roles];
      return allowed.includes(user.role);
    },
    [user],
  );

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      accessToken,
      isLoading,
      error,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
      hasRole,
    }),
    [user, accessToken, isLoading, error, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}

