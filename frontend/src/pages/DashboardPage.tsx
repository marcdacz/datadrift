import { HealthStatus } from "../components/HealthStatus";
import { PlaceholderPage } from "./PlaceholderPage";
import styles from "./DashboardPage.module.css";

/**
 * Dashboard placeholder. Shows backend health status.
 * TODO: Add overview widgets, recent activity, quick actions.
 */
export function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Overview of monitors, data sources, and recent activity."
    >
      <div className={styles.content}>
        <HealthStatus />
        <div className={styles.placeholder} aria-hidden>
          Content area — placeholder
        </div>
      </div>
    </PlaceholderPage>
  );
}
