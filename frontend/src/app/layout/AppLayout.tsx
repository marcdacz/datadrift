import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Global layout: header full width on top, then sidebar + main content.
 * TODO: Add responsive behavior, collapsible sidebar.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <Header />
      </div>
      <div className={styles.bodyRow}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
