import { useAuthContext } from "../app/auth/AuthContext";

/**
 * Convenience hook for consuming auth state and actions.
 */
export function useAuth() {
  return useAuthContext();
}

