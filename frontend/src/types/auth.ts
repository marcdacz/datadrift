/**
 * Auth and role domain types for the frontend.
 *
 * Roles and capabilities mirror `docs/userflows/login-and-roles.md`:
 *
 * - Admin:
 *   - Can manage system settings: Data Sources, Teams, Data Views, Automations.
 *   - Can create charts/visualisations and report templates.
 *   - Can see execution/audit logs.
 * - Manager:
 *   - Can manage Data Views and Automations.
 *   - Can create charts/visualisations and report templates.
 *   - Can see execution/audit logs.
 * - User:
 *   - Can view charts/visualisations shared with them.
 *   - Can view and download reports shared with them.
 *   - Cannot access Settings or manage data sources, data views, automations, or teams.
 */

export type Role = "admin" | "manager" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  /**
   * Access token or opaque session identifier returned by the backend.
   * Concrete shape is intentionally abstracted behind the API layer.
   */
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

