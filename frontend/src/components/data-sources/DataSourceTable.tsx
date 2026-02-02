import { Link } from "react-router-dom";
import type { DataSource } from "../../types/dataSources";
import styles from "./DataSourceTable.module.css";

interface DataSourceTableProps {
  dataSources: DataSource[];
  onTestConnection: (id: string) => void;
  onDelete: (id: string) => void;
  isTestingId: string | null;
  isDeletingId: string | null;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function DataSourceTable({
  dataSources,
  onTestConnection,
  onDelete,
  isTestingId,
  isDeletingId,
}: DataSourceTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table} role="grid" aria-label="Data sources">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Last tested</th>
            <th scope="col">Created at</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataSources.map((ds) => (
            <tr key={ds.id}>
              <td>
                <Link to={`/data-sources/${ds.id}/edit`} className={styles.nameLink}>
                  {ds.name}
                </Link>
              </td>
              <td>{ds.type}</td>
              <td>
                <span className={styles.badge} aria-label="Status">
                  —
                </span>
              </td>
              <td>{formatDate(ds.updatedAt)}</td>
              <td>{formatDate(ds.createdAt)}</td>
              <td>
                <div className={styles.actions}>
                  <Link
                    to={`/data-sources/${ds.id}/edit`}
                    className={styles.btnSecondary}
                    aria-label={`Edit ${ds.name}`}
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => onTestConnection(ds.id)}
                    disabled={isTestingId !== null}
                    aria-label={`Test connection for ${ds.name}`}
                  >
                    {isTestingId === ds.id ? "Testing…" : "Test connection"}
                  </button>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={() => onDelete(ds.id)}
                    disabled={isDeletingId !== null}
                    aria-label={`Delete ${ds.name}`}
                  >
                    {isDeletingId === ds.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
