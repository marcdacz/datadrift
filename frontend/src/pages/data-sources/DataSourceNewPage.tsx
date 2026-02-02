import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DataSourceForm } from "../../components/data-sources/DataSourceForm";
import { createDataSource } from "../../api/dataSources";
import type { CreateDataSourceRequest } from "../../types/dataSources";
import styles from "./DataSourceNewPage.module.css";

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
    <div className={styles.root}>
      <h1 className={styles.title}>Add data source</h1>
      <DataSourceForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create"
      />
      {createMutation.isError && (
        <p className={styles.formError} role="alert">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Failed to create data source."}
        </p>
      )}
    </div>
  );
}
