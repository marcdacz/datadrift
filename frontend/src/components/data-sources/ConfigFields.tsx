import type { DataSourceType } from "../../types/dataSources";
import type { ConfigCsv, ConfigJson, ConfigDatabase, ConfigRest } from "../../types/dataSources";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/forms/FormField";
import { cn } from "@/lib/utils";

const MASKED_PLACEHOLDER = "••••••••";

export interface ConfigFormState {
  csv?: Partial<ConfigCsv>;
  json?: Partial<ConfigJson>;
  database?: Partial<ConfigDatabase>;
  rest?: Partial<ConfigRest>;
}

interface ConfigFieldsProps {
  type: DataSourceType;
  state: ConfigFormState;
  errors: Record<string, string>;
  isEdit: boolean;
  updateSecretKeys: Set<string>;
  onFieldChange: (key: string, value: string | number | undefined) => void;
  onUpdateSecretChange: (key: string, checked: boolean) => void;
}

const sectionClass = "rounded-md border border-border bg-muted/30 p-4 space-y-4";
const sectionTitleClass = "text-sm font-semibold text-muted-foreground m-0 mb-2";

export function ConfigFields({
  type,
  state,
  errors,
  isEdit,
  updateSecretKeys,
  onFieldChange,
  onUpdateSecretChange,
}: ConfigFieldsProps) {
  if (type === "CSV") {
    const c = state.csv ?? {};
    return (
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>CSV configuration</h3>
        <FormField id="config-path" label="Path or URL" error={errors.path}>
          <Input
            id="config-path"
            type="text"
            value={c.path ?? c.url ?? ""}
            onChange={(e) => onFieldChange("path", e.target.value || undefined)}
            placeholder="/path/to/file.csv or https://..."
            className={errors.path ? "border-destructive focus-visible:ring-destructive" : undefined}
          />
        </FormField>
        <FormField id="config-encoding" label="Encoding">
          <Input
            id="config-encoding"
            type="text"
            value={c.encoding ?? ""}
            onChange={(e) => onFieldChange("encoding", e.target.value || undefined)}
            placeholder="utf-8"
          />
        </FormField>
      </div>
    );
  }

  if (type === "JSON") {
    const c = state.json ?? {};
    return (
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>JSON configuration</h3>
        <FormField id="config-json-path" label="Path or URL" error={errors.path}>
          <Input
            id="config-json-path"
            type="text"
            value={c.path ?? c.url ?? ""}
            onChange={(e) => onFieldChange("path", e.target.value || undefined)}
            placeholder="/path/to/file.json or https://..."
            className={errors.path ? "border-destructive focus-visible:ring-destructive" : undefined}
          />
        </FormField>
        <FormField id="config-json-encoding" label="Encoding">
          <Input
            id="config-json-encoding"
            type="text"
            value={c.encoding ?? ""}
            onChange={(e) => onFieldChange("encoding", e.target.value || undefined)}
            placeholder="utf-8"
          />
        </FormField>
      </div>
    );
  }

  if (type === "DATABASE") {
    const c = state.database ?? {};
    return (
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Database configuration</h3>
        <FormField id="config-host" label="Host" required error={errors.host}>
          <Input
            id="config-host"
            type="text"
            value={c.host ?? ""}
            onChange={(e) => onFieldChange("host", e.target.value)}
            placeholder="localhost"
            className={errors.host ? "border-destructive focus-visible:ring-destructive" : undefined}
          />
        </FormField>
        <FormField id="config-port" label="Port">
          <Input
            id="config-port"
            type="number"
            value={c.port ?? ""}
            onChange={(e) =>
              onFieldChange("port", e.target.value === "" ? undefined : parseInt(e.target.value, 10))
            }
            placeholder="5432"
          />
        </FormField>
        <FormField id="config-database" label="Database" required error={errors.database}>
          <Input
            id="config-database"
            type="text"
            value={c.database ?? ""}
            onChange={(e) => onFieldChange("database", e.target.value)}
            placeholder="mydb"
            className={errors.database ? "border-destructive focus-visible:ring-destructive" : undefined}
          />
        </FormField>
        <FormField id="config-username" label="Username" required error={errors.username}>
          <Input
            id="config-username"
            type="text"
            value={c.username ?? ""}
            onChange={(e) => onFieldChange("username", e.target.value)}
            placeholder="user"
            className={errors.username ? "border-destructive focus-visible:ring-destructive" : undefined}
          />
        </FormField>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="config-password">Password</Label>
          {isEdit && !updateSecretKeys.has("password") ? (
            <>
              <Input
                id="config-password"
                type="text"
                value=""
                readOnly
                placeholder={MASKED_PLACEHOLDER}
                aria-label="Password (masked)"
              />
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="config-update-password"
                  checked={updateSecretKeys.has("password")}
                  onCheckedChange={(checked) =>
                    onUpdateSecretChange("password", checked === true)
                  }
                  aria-label="Update password"
                />
                <Label htmlFor="config-update-password" className="font-normal text-sm cursor-pointer">
                  Update secret
                </Label>
              </div>
            </>
          ) : (
            <Input
              id="config-password"
              type="password"
              value={state.database?.password ?? ""}
              onChange={(e) => onFieldChange("password", e.target.value || undefined)}
              placeholder={isEdit ? "Enter new password" : "Password"}
              autoComplete="new-password"
            />
          )}
        </div>
      </div>
    );
  }

  if (type === "REST") {
    const c = state.rest ?? {};
    return (
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>REST API configuration</h3>
        <FormField id="config-url" label="URL" required error={errors.url}>
          <Input
            id="config-url"
            type="url"
            value={c.url ?? ""}
            onChange={(e) => onFieldChange("url", e.target.value)}
            placeholder="https://api.example.com"
            className={errors.url ? "border-destructive focus-visible:ring-destructive" : undefined}
          />
        </FormField>
        <div className={cn("flex flex-col gap-1.5")}>
          <Label htmlFor="config-apiKey">API Key</Label>
          {isEdit && !updateSecretKeys.has("apiKey") ? (
            <>
              <Input
                id="config-apiKey"
                type="text"
                value=""
                readOnly
                placeholder={MASKED_PLACEHOLDER}
                aria-label="API Key (masked)"
              />
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="config-update-apiKey"
                  checked={updateSecretKeys.has("apiKey")}
                  onCheckedChange={(checked) =>
                    onUpdateSecretChange("apiKey", checked === true)
                  }
                  aria-label="Update API Key"
                />
                <Label htmlFor="config-update-apiKey" className="font-normal text-sm cursor-pointer">
                  Update secret
                </Label>
              </div>
            </>
          ) : (
            <Input
              id="config-apiKey"
              type="password"
              value={state.rest?.apiKey ?? ""}
              onChange={(e) => onFieldChange("apiKey", e.target.value || undefined)}
              placeholder={isEdit ? "Enter new API key" : "API key"}
              autoComplete="off"
            />
          )}
        </div>
        <div className={cn("flex flex-col gap-1.5")}>
          <Label htmlFor="config-token">Bearer Token (alternative)</Label>
          {isEdit && !updateSecretKeys.has("token") ? (
            <>
              <Input
                id="config-token"
                type="text"
                value=""
                readOnly
                placeholder={MASKED_PLACEHOLDER}
                aria-label="Token (masked)"
              />
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="config-update-token"
                  checked={updateSecretKeys.has("token")}
                  onCheckedChange={(checked) =>
                    onUpdateSecretChange("token", checked === true)
                  }
                  aria-label="Update token"
                />
                <Label htmlFor="config-update-token" className="font-normal text-sm cursor-pointer">
                  Update secret
                </Label>
              </div>
            </>
          ) : (
            <Input
              id="config-token"
              type="password"
              value={state.rest?.token ?? ""}
              onChange={(e) => onFieldChange("token", e.target.value || undefined)}
              placeholder={isEdit ? "Enter new token" : "Bearer token"}
              autoComplete="off"
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}
