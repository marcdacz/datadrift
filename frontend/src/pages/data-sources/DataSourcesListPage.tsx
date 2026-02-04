import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  fetchDataSources,
  deleteDataSource,
  testConnectionById,
} from "../../api/dataSources";
import { DataSourceTable } from "../../components/data-sources/DataSourceTable";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Database, CheckCircle2, XCircle } from "lucide-react";

export function DataSourcesListPage() {
  const queryClient = useQueryClient();
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    id: string;
    success: boolean;
    message: string;
  } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: dataSources = [], isLoading, error } = useQuery({
    queryKey: ["data-sources"],
    queryFn: fetchDataSources,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-sources"] });
      setDeletingId(null);
      setDeleteConfirmId(null);
      setDeleteError(null);
    },
    onError: (err: unknown) => {
      setDeletingId(null);
      setDeleteConfirmId(null);
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete data source.",
      );
    },
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

  function handleDeleteClick(id: string) {
    setDeleteError(null);
    setDeleteConfirmId(id);
  }

  function handleDeleteConfirm() {
    if (deleteConfirmId) {
      setDeletingId(deleteConfirmId);
      deleteMutation.mutate(deleteConfirmId);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-xl font-semibold text-foreground tracking-tight mb-6">Data Sources</h1>
        <LoadingSpinner message="Loading…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-xl font-semibold text-foreground tracking-tight mb-6">Data Sources</h1>
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load data sources."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <header className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-xl font-semibold text-foreground tracking-tight m-0">Data Sources</h1>
        <Button asChild>
          <Link to="/data-sources/new" aria-label="Add data source">
            Add data source
          </Link>
        </Button>
      </header>

      {testResult && (
        <Alert
          variant={testResult.success ? "default" : "destructive"}
          className="mb-4"
          role="status"
          aria-live="polite"
        >
          {testResult.success ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>{testResult.message}</AlertDescription>
        </Alert>
      )}

      {deleteError && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {dataSources.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No data sources yet"
          description="Connect your first data source to start monitoring and automating."
          actions={[{ label: "Add data source", to: "/data-sources/new", primary: true }]}
        />
      ) : (
        <DataSourceTable
          dataSources={dataSources}
          onTestConnection={handleTestConnection}
          onDelete={handleDeleteClick}
          isTestingId={testingId}
          isDeletingId={deletingId}
        />
      )}

      <ConfirmDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        title="Delete data source"
        description="Delete this data source? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        destructive
      />
    </div>
  );
}
