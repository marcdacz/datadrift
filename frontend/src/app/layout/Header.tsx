import styles from "./Header.module.css";

/**
 * Top header: app name, global search placeholder, user avatar placeholder.
 * TODO: Wire search, user menu, notifications.
 */
export function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.appName} aria-label="DataDrift">
        DataDrift
      </span>
      <div className={styles.search}>
        <input
          type="search"
          placeholder="Search data, monitors, recents..."
          className={styles.searchInput}
          disabled
          aria-label="Global search (placeholder)"
        />
      </div>
      <div className={styles.actions}>
        <div className={styles.avatar} title="User (placeholder)" aria-hidden>
          <span>U</span>
        </div>
      </div>
    </header>
  );
}
