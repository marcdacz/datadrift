import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard" },
  { path: "/data-sources", label: "Data Sources" },
  { path: "/data-views", label: "Data Views" },
  { path: "/automation-rules", label: "Automation Rules" },
  { path: "/executions", label: "Executions" },
  { path: "/reports", label: "Reports" },
  { path: "/templates", label: "Templates" },
  { path: "/audit-logs", label: "Audit Logs" },
  { path: "/settings", label: "Settings" },
] as const;

/**
 * Left-hand sidebar navigation. Stub only; each link routes to a placeholder page.
 * TODO: Add icons, grouping, active state refinements.
 */
export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label="Main navigation">
        {NAV_ITEMS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              [styles.link, isActive ? styles.linkActive : ""].filter(Boolean).join(" ")
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
