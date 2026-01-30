import { useEffect, useState } from "react";
import { fetchHealth } from "../api/health";
import styles from "./HealthStatus.module.css";

type Status = "idle" | "connected" | "unreachable";

/**
 * Displays backend health: calls GET /api/health and shows "Backend connected" or "Backend unreachable".
 * TODO: Polling, retry button, show version when connected.
 */
export function HealthStatus() {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;
    setStatus("idle");
    fetchHealth()
      .then(() => {
        if (!cancelled) setStatus("connected");
      })
      .catch(() => {
        if (!cancelled) setStatus("unreachable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "idle") {
    return (
      <div className={styles.root} role="status" aria-live="polite">
        <span className={styles.dot} data-state="idle" />
        <span>Checking backend…</span>
      </div>
    );
  }

  const isConnected = status === "connected";
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <span
        className={styles.dot}
        data-state={isConnected ? "connected" : "unreachable"}
        aria-hidden
      />
      <span>{isConnected ? "Backend connected" : "Backend unreachable"}</span>
    </div>
  );
}
