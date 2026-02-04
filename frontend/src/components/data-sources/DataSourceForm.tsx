import { useState, useCallback, useEffect } from "react";
import type { DataSourceType, CreateDataSourceRequest } from "../../types/dataSources";
import { ConfigFields, type ConfigFormState } from "./ConfigFields";
import { buildConfig, parseConfig, validateConfig } from "./configUtils";
import { testConnection } from "../../api/dataSources";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle } from "lucide-react";

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
    <Card className="max-w-2xl">
      <CardHeader className="sr-only">
        <h2>{isEdit ? "Edit data source" : "New data source"}</h2>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormField id="ds-name" label="Name" required error={errors.name}>
            <Input
              id="ds-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="My data source"
              autoComplete="off"
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : undefined}
            />
          </FormField>

          <FormField id="ds-type" label="Data source type" required>
            <Select value={type} onValueChange={(v) => handleTypeChange(v as DataSourceType)}>
              <SelectTrigger id="ds-type" aria-label="Data source type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATA_SOURCE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t === "REST" ? "REST API" : t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <ConfigFields
            type={type}
            state={configState}
            errors={errors}
            isEdit={isEdit}
            updateSecretKeys={updateSecretKeys}
            onFieldChange={handleConfigFieldChange}
            onUpdateSecretChange={handleUpdateSecretChange}
          />

          <div className="flex items-center gap-3 flex-wrap pt-2">
            <Button type="submit" disabled={isTesting}>
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              {isTesting ? "Testing…" : "Test connection"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          {testResult && (
            <Alert
              variant={testResult.success ? "default" : "destructive"}
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
        </form>
      </CardContent>
    </Card>
  );
}
