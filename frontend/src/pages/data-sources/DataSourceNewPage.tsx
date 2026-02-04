import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DataSourceForm } from "../../components/data-sources/DataSourceForm";
import { createDataSource } from "../../api/dataSources";
import type { CreateDataSourceRequest } from "../../types/dataSources";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

export function DataSourceNewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createDataSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data-sources"] });
      navigate("/data-sources", { replace: true });
    },
  });

  function handleSubmit(body: CreateDataSourceRequest) {
    createMutation.mutate(body);
  }

  function handleCancel() {
    navigate("/data-sources");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-foreground tracking-tight mb-6">
        Add data source
      </h1>
      <DataSourceForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create"
      />
      {createMutation.isError && (
        <Alert variant="destructive" className="mt-4" role="alert">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : "Failed to create data source."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
