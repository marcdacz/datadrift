import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { DataSourceForm, type DataSourceFormInitial } from "../../components/data-sources/DataSourceForm";
import { fetchDataSourceById, updateDataSource } from "../../api/dataSources";
import type { CreateDataSourceRequest } from "../../types/dataSources";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { XCircle } from "lucide-react";

export function DataSourceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["data-sources", id],
    queryFn: () => fetchDataSourceById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id: dsId, body }: { id: string; body: CreateDataSourceRequest }) =>
      updateDataSource(dsId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-sources"] });
      queryClient.invalidateQueries({ queryKey: ["data-sources", id] });
    },
  });

  function handleSubmit(body: CreateDataSourceRequest) {
    if (!id) return;
    updateMutation.mutate({ id, body });
  }

  function handleCancel() {
    navigate("/data-sources");
  }

  if (!id) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-foreground tracking-tight mb-6">
          Edit data source
        </h1>
        <Alert variant="destructive" role="alert">
          <XCircle className="h-4 w-4" />
          <AlertDescription>Missing data source ID.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-foreground tracking-tight mb-6">
          Edit data source
        </h1>
        <LoadingSpinner message="Loading…" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-foreground tracking-tight mb-6">
          Edit data source
        </h1>
        <Alert variant="destructive" role="alert">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Data source not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const initial: DataSourceFormInitial = {
    name: data.name,
    type: data.type,
    config: data.config,
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground tracking-tight mb-6">
        Edit data source
      </h1>
      <DataSourceForm
        mode="edit"
        initial={initial}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Save"
      />
      {updateMutation.isError && (
        <Alert variant="destructive" className="mt-4" role="alert">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : "Failed to save."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
