import type { ReactNode } from "react";
import styles from "./PlaceholderPage.module.css";

interface PlaceholderPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * Shared placeholder page shell: title, description, optional content.
 */
export function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      {children ?? (
        <div className={styles.placeholder} aria-hidden>
          Content area — placeholder
        </div>
      )}
    </div>
  );
}
