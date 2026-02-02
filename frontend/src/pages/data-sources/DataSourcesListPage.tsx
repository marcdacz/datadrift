import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  fetchDataSources,
  deleteDataSource,
  testConnectionById,
} from "../../api/dataSources";
import { DataSourceTable } from "../../components/data-sources/DataSourceTable";
import styles from "./DataSourcesListPage.module.css";

export function DataSourcesListPage() {
  const queryClient = useQueryClient();
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    id: string;
    success: boolean;
    message: string;
  } | null>(null);

  const { data: dataSources = [], isLoading, error } = useQuery({
    queryKey: ["data-sources"],
    queryFn: fetchDataSources,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-sources"] });
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  async function handleTestConnection(id: string) {
    setTestResult(null);
    setTestingId(id);
    try {
      const result = await testConnectionById(id);
      setTestResult({
        id,
        success: result.success,
        message: result.message ?? (result.success ? "Connection validated." : "Connection failed."),
      });
    } catch (err) {
      setTestResult({
        id,
        success: false,
        message: err instanceof Error ? err.message : "Test failed.",
      });
    } finally {
      setTestingId(null);
    }
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this data source? This cannot be undone.")) return;
    setDeletingId(id);
    deleteMutation.mutate(id);
  }

  if (isLoading) {
    return (
      <div className={styles.root}>
        <h1 className={styles.title}>Data Sources</h1>
        <p className={styles.loading} role="status">
          Loading…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.root}>
        <h1 className={styles.title}>Data Sources</h1>
        <p className={styles.error} role="alert">
          {error instanceof Error ? error.message : "Failed to load data sources."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Data Sources</h1>
        <Link
          to="/data-sources/new"
          className={styles.primaryButton}
          aria-label="Add data source"
        >
          Add data source
        </Link>
      </header>

      {testResult && (
        <div
          className={testResult.success ? styles.testSuccess : styles.testError}
          role="status"
          aria-live="polite"
        >
          {testResult.message}
        </div>
      )}

      {dataSources.length === 0 ? (
        <div className={styles.emptyRoot}>
          <h2 className={styles.emptyTitle}>No data sources yet</h2>
          <p className={styles.emptyDesc}>
            Connect your first data source to start monitoring and automating.
          </p>
          <Link to="/data-sources/new" className={styles.primaryButton}>
            Add data source
          </Link>
        </div>
      ) : (
        <DataSourceTable
          dataSources={dataSources}
          onTestConnection={handleTestConnection}
          onDelete={handleDelete}
          isTestingId={testingId}
          isDeletingId={deletingId}
        />
      )}
    </div>
  );
}
