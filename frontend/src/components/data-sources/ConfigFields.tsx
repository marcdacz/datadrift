import type { DataSourceType } from "../../types/dataSources";
import type { ConfigCsv, ConfigJson, ConfigDatabase, ConfigRest } from "../../types/dataSources";
import styles from "./DataSourceForm.module.css";

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
      <div className={styles.configSection}>
        <h3 className={styles.configSectionTitle}>CSV configuration</h3>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-path" className={styles.label}>
            Path or URL
          </label>
          <input
            id="config-path"
            type="text"
            className={styles.input}
            value={c.path ?? c.url ?? ""}
            onChange={(e) => onFieldChange("path", e.target.value || undefined)}
            placeholder="/path/to/file.csv or https://..."
          />
          {errors.path && <span className={styles.errorText}>{errors.path}</span>}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-encoding" className={styles.label}>
            Encoding
          </label>
          <input
            id="config-encoding"
            type="text"
            className={styles.input}
            value={c.encoding ?? ""}
            onChange={(e) => onFieldChange("encoding", e.target.value || undefined)}
            placeholder="utf-8"
          />
        </div>
      </div>
    );
  }

  if (type === "JSON") {
    const c = state.json ?? {};
    return (
      <div className={styles.configSection}>
        <h3 className={styles.configSectionTitle}>JSON configuration</h3>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-json-path" className={styles.label}>
            Path or URL
          </label>
          <input
            id="config-json-path"
            type="text"
            className={styles.input}
            value={c.path ?? c.url ?? ""}
            onChange={(e) => onFieldChange("path", e.target.value || undefined)}
            placeholder="/path/to/file.json or https://..."
          />
          {errors.path && <span className={styles.errorText}>{errors.path}</span>}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-json-encoding" className={styles.label}>
            Encoding
          </label>
          <input
            id="config-json-encoding"
            type="text"
            className={styles.input}
            value={c.encoding ?? ""}
            onChange={(e) => onFieldChange("encoding", e.target.value || undefined)}
            placeholder="utf-8"
          />
        </div>
      </div>
    );
  }

  if (type === "DATABASE") {
    const c = state.database ?? {};
    return (
      <div className={styles.configSection}>
        <h3 className={styles.configSectionTitle}>Database configuration</h3>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-host" className={styles.label + " " + styles.labelRequired}>
            Host
          </label>
          <input
            id="config-host"
            type="text"
            className={styles.input + (errors.host ? " " + styles.inputError : "")}
            value={c.host ?? ""}
            onChange={(e) => onFieldChange("host", e.target.value)}
            placeholder="localhost"
          />
          {errors.host && <span className={styles.errorText}>{errors.host}</span>}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-port" className={styles.label}>
            Port
          </label>
          <input
            id="config-port"
            type="number"
            className={styles.input}
            value={c.port ?? ""}
            onChange={(e) =>
              onFieldChange("port", e.target.value === "" ? undefined : parseInt(e.target.value, 10))
            }
            placeholder="5432"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-database" className={styles.label + " " + styles.labelRequired}>
            Database
          </label>
          <input
            id="config-database"
            type="text"
            className={styles.input + (errors.database ? " " + styles.inputError : "")}
            value={c.database ?? ""}
            onChange={(e) => onFieldChange("database", e.target.value)}
            placeholder="mydb"
          />
          {errors.database && <span className={styles.errorText}>{errors.database}</span>}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-username" className={styles.label + " " + styles.labelRequired}>
            Username
          </label>
          <input
            id="config-username"
            type="text"
            className={styles.input + (errors.username ? " " + styles.inputError : "")}
            value={c.username ?? ""}
            onChange={(e) => onFieldChange("username", e.target.value)}
            placeholder="user"
          />
          {errors.username && <span className={styles.errorText}>{errors.username}</span>}
        </div>
        <div className={styles.fieldGroup + " " + styles.secretRow}>
          <label htmlFor="config-password" className={styles.label}>
            Password
          </label>
          {isEdit && !updateSecretKeys.has("password") ? (
            <>
              <input
                id="config-password"
                type="text"
                className={styles.input}
                value=""
                readOnly
                placeholder={MASKED_PLACEHOLDER}
                aria-label="Password (masked)"
              />
              <div className={styles.checkboxRow}>
                <input
                  id="config-update-password"
                  type="checkbox"
                  checked={updateSecretKeys.has("password")}
                  onChange={(e) => onUpdateSecretChange("password", e.target.checked)}
                  aria-label="Update password"
                />
                <label htmlFor="config-update-password" className={styles.label}>
                  Update secret
                </label>
              </div>
            </>
          ) : (
            <input
              id="config-password"
              type="password"
              className={styles.input}
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
      <div className={styles.configSection}>
        <h3 className={styles.configSectionTitle}>REST API configuration</h3>
        <div className={styles.fieldGroup}>
          <label htmlFor="config-url" className={styles.label + " " + styles.labelRequired}>
            URL
          </label>
          <input
            id="config-url"
            type="url"
            className={styles.input + (errors.url ? " " + styles.inputError : "")}
            value={c.url ?? ""}
            onChange={(e) => onFieldChange("url", e.target.value)}
            placeholder="https://api.example.com"
          />
          {errors.url && <span className={styles.errorText}>{errors.url}</span>}
        </div>
        <div className={styles.fieldGroup + " " + styles.secretRow}>
          <label htmlFor="config-apiKey" className={styles.label}>
            API Key
          </label>
          {isEdit && !updateSecretKeys.has("apiKey") ? (
            <>
              <input
                id="config-apiKey"
                type="text"
                className={styles.input}
                value=""
                readOnly
                placeholder={MASKED_PLACEHOLDER}
                aria-label="API Key (masked)"
              />
              <div className={styles.checkboxRow}>
                <input
                  id="config-update-apiKey"
                  type="checkbox"
                  checked={updateSecretKeys.has("apiKey")}
                  onChange={(e) => onUpdateSecretChange("apiKey", e.target.checked)}
                  aria-label="Update API Key"
                />
                <label htmlFor="config-update-apiKey" className={styles.label}>
                  Update secret
                </label>
              </div>
            </>
          ) : (
            <input
              id="config-apiKey"
              type="password"
              className={styles.input}
              value={state.rest?.apiKey ?? ""}
              onChange={(e) => onFieldChange("apiKey", e.target.value || undefined)}
              placeholder={isEdit ? "Enter new API key" : "API key"}
              autoComplete="off"
            />
          )}
        </div>
        <div className={styles.fieldGroup + " " + styles.secretRow}>
          <label htmlFor="config-token" className={styles.label}>
            Bearer Token (alternative)
          </label>
          {isEdit && !updateSecretKeys.has("token") ? (
            <>
              <input
                id="config-token"
                type="text"
                className={styles.input}
                value=""
                readOnly
                placeholder={MASKED_PLACEHOLDER}
                aria-label="Token (masked)"
              />
              <div className={styles.checkboxRow}>
                <input
                  id="config-update-token"
                  type="checkbox"
                  checked={updateSecretKeys.has("token")}
                  onChange={(e) => onUpdateSecretChange("token", e.target.checked)}
                  aria-label="Update token"
                />
                <label htmlFor="config-update-token" className={styles.label}>
                  Update secret
                </label>
              </div>
            </>
          ) : (
            <input
              id="config-token"
              type="password"
              className={styles.input}
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
