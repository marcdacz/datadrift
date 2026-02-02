import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { DataSourceForm, type DataSourceFormInitial } from "../../components/data-sources/DataSourceForm";
import { fetchDataSourceById, updateDataSource } from "../../api/dataSources";
import type { CreateDataSourceRequest } from "../../types/dataSources";
import styles from "./DataSourceEditPage.module.css";

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
      <div className={styles.root}>
        <h1 className={styles.title}>Edit data source</h1>
        <p className={styles.error} role="alert">
          Missing data source ID.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.root}>
        <h1 className={styles.title}>Edit data source</h1>
        <p className={styles.loading} role="status">
          Loading…
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.root}>
        <h1 className={styles.title}>Edit data source</h1>
        <p className={styles.error} role="alert">
          {error instanceof Error ? error.message : "Data source not found."}
        </p>
      </div>
    );
  }

  const initial: DataSourceFormInitial = {
    name: data.name,
    type: data.type,
    config: data.config,
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Edit data source</h1>
      <DataSourceForm
        mode="edit"
        initial={initial}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Save"
      />
      {updateMutation.isError && (
        <p className={styles.submitError} role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "Failed to save."}
        </p>
      )}
    </div>
  );
}
