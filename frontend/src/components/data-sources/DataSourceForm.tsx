import { useState, useCallback, useEffect } from "react";
import type { DataSourceType, CreateDataSourceRequest } from "../../types/dataSources";
import { ConfigFields, type ConfigFormState } from "./ConfigFields";
import { buildConfig, parseConfig, validateConfig } from "./configUtils";
import { testConnection } from "../../api/dataSources";
import styles from "./DataSourceForm.module.css";

const DATA_SOURCE_TYPES: DataSourceType[] = ["CSV", "JSON", "DATABASE", "REST"];

export interface DataSourceFormInitial {
  name: string;
  type: DataSourceType;
  config: string;
}

interface DataSourceFormProps {
  mode: "create" | "edit";
  initial?: DataSourceFormInitial;
  onSubmit: (body: CreateDataSourceRequest) => void;
  onCancel: () => void;
  submitLabel?: string;
}

function getEmptyConfigState(type: DataSourceType): ConfigFormState {
  switch (type) {
    case "CSV":
      return { csv: {} };
    case "JSON":
      return { json: {} };
    case "DATABASE":
      return { database: { host: "", database: "", username: "" } };
    case "REST":
      return { rest: { url: "" } };
    default:
      return {};
  }
}

export function DataSourceForm({
  mode,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: DataSourceFormProps) {
  const isEdit = mode === "edit";

  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<DataSourceType>(initial?.type ?? "REST");
  const [configState, setConfigState] = useState<ConfigFormState>(() =>
    initial ? parseConfig(initial.config, initial.type) : getEmptyConfigState("REST")
  );
  const [updateSecretKeys, setUpdateSecretKeys] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setType(initial.type);
      setConfigState(parseConfig(initial.config, initial.type));
    }
  }, [initial]);

  const handleTypeChange = useCallback((newType: DataSourceType) => {
    setType(newType);
    setConfigState(getEmptyConfigState(newType));
    setUpdateSecretKeys(new Set());
    setErrors({});
    setTestResult(null);
  }, []);

  const handleConfigFieldChange = useCallback(
    (key: string, value: string | number | undefined) => {
      setConfigState((prev) => {
        const next = { ...prev };
        if (type === "CSV") {
          next.csv = { ...prev.csv, [key]: value };
        } else if (type === "JSON") {
          next.json = { ...prev.json, [key]: value };
        } else if (type === "DATABASE") {
          next.database = { ...prev.database, [key]: value };
        } else if (type === "REST") {
          next.rest = { ...prev.rest, [key]: value };
        }
        return next;
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setTestResult(null);
    },
    [type]
  );

  const handleUpdateSecretChange = useCallback((key: string, checked: boolean) => {
    setUpdateSecretKeys((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
    setTestResult(null);
  }, []);

  const runValidation = useCallback((): boolean => {
    const nameTrim = name.trim();
    const nameErrors: Record<string, string> = {};
    if (!nameTrim) nameErrors.name = "Name is required.";
    const configErrors = validateConfig(type, configState);
    const all = { ...nameErrors, ...configErrors };
    setErrors(all);
    return Object.keys(all).length === 0;
  }, [name, type, configState]);

  const handleTestConnection = useCallback(async () => {
    if (!runValidation()) return;
    setTestResult(null);
    setIsTesting(true);
    const configJson = buildConfig(type, configState, isEdit, updateSecretKeys);
    try {
      const result = await testConnection({
        name: name.trim(),
        type,
        config: configJson,
      });
      setTestResult({
        success: result.success,
        message: result.message ?? (result.success ? "Connection validated." : "Connection failed."),
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : "Test failed.",
      });
    } finally {
      setIsTesting(false);
    }
  }, [name, type, configState, isEdit, updateSecretKeys, runValidation]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!runValidation()) return;
      const configJson = buildConfig(type, configState, isEdit, updateSecretKeys);
      onSubmit({
        name: name.trim(),
        type,
        config: configJson,
      });
    },
    [name, type, configState, isEdit, updateSecretKeys, onSubmit, runValidation]
  );

  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="ds-name" className={styles.label + " " + styles.labelRequired}>
            Name
          </label>
          <input
            id="ds-name"
            type="text"
            className={styles.input + (errors.name ? " " + styles.inputError : "")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="My data source"
            autoComplete="off"
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="ds-type" className={styles.label + " " + styles.labelRequired}>
            Data source type
          </label>
          <select
            id="ds-type"
            className={styles.input}
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as DataSourceType)}
            aria-label="Data source type"
          >
            {DATA_SOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "REST" ? "REST API" : t}
              </option>
            ))}
          </select>
        </div>

        <ConfigFields
          type={type}
          state={configState}
          errors={errors}
          isEdit={isEdit}
          updateSecretKeys={updateSecretKeys}
          onFieldChange={handleConfigFieldChange}
          onUpdateSecretChange={handleUpdateSecretChange}
        />

        <div className={styles.actions}>
          <button type="submit" className={styles.primaryButton} disabled={isTesting}>
            {submitLabel}
          </button>
          <button
            type="button"
            className={styles.testButton}
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            {isTesting ? "Testing…" : "Test connection"}
          </button>
          <button type="button" className={styles.secondaryButton} onClick={onCancel}>
            Cancel
          </button>
        </div>

        {testResult && (
          <div
            className={
              testResult.success ? styles.testResultSuccess : styles.testResultError
            }
            role="status"
            aria-live="polite"
          >
            {testResult.message}
          </div>
        )}
      </form>
    </div>
  );
}
