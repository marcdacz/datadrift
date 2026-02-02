import type { DataSourceType } from "../../types/dataSources";
import type { ConfigFormState } from "./ConfigFields";

const MASKED = "******";

function isMasked(value: unknown): boolean {
  return value === MASKED || value === "" || value === undefined;
}

/**
 * Parse API config JSON (masked on edit) into form state. Secrets are never read; masked values
 * are omitted so the form shows placeholders and "Update secret" on edit.
 */
export function parseConfig(
  configJson: string,
  type: DataSourceType
): ConfigFormState {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(configJson) as Record<string, unknown>;
  } catch {
    return {};
  }

  if (type === "CSV") {
    const pathOrUrl = parsed.path ?? parsed.url;
    return {
      csv: {
        path: typeof pathOrUrl === "string" && !isMasked(pathOrUrl) ? (pathOrUrl as string) : undefined,
        encoding: typeof parsed.encoding === "string" && !isMasked(parsed.encoding) ? (parsed.encoding as string) : undefined,
      },
    };
  }

  if (type === "JSON") {
    const pathOrUrl = parsed.path ?? parsed.url;
    return {
      json: {
        path: typeof pathOrUrl === "string" && !isMasked(pathOrUrl) ? (pathOrUrl as string) : undefined,
        encoding: typeof parsed.encoding === "string" && !isMasked(parsed.encoding) ? (parsed.encoding as string) : undefined,
      },
    };
  }

  if (type === "DATABASE") {
    return {
      database: {
        host: typeof parsed.host === "string" ? parsed.host : "",
        port: typeof parsed.port === "number" ? parsed.port : undefined,
        database: typeof parsed.database === "string" ? parsed.database : "",
        username: typeof parsed.username === "string" ? parsed.username : "",
        /* password never read back; masked on edit */
      },
    };
  }

  if (type === "REST") {
    return {
      rest: {
        url: typeof parsed.url === "string" ? parsed.url : "",
        /* apiKey and token never read back; masked on edit */
      },
    };
  }

  return {};
}

/**
 * Build config JSON from form state. On edit, sensitive keys not in updateSecretKeys are sent as
 * "******" so the backend preserves existing values.
 */
export function buildConfig(
  type: DataSourceType,
  state: ConfigFormState,
  isEdit: boolean,
  updateSecretKeys: Set<string>
): string {
  if (type === "CSV") {
    const c = state.csv ?? {};
    const pathOrUrl = c.path ?? c.url ?? "";
    const obj: Record<string, string> = {};
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      obj.url = pathOrUrl;
    } else {
      obj.path = pathOrUrl;
    }
    if (c.encoding) obj.encoding = c.encoding;
    return JSON.stringify(obj);
  }

  if (type === "JSON") {
    const c = state.json ?? {};
    const pathOrUrl = c.path ?? c.url ?? "";
    const obj: Record<string, string> = {};
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      obj.url = pathOrUrl;
    } else {
      obj.path = pathOrUrl;
    }
    if (c.encoding) obj.encoding = c.encoding;
    return JSON.stringify(obj);
  }

  if (type === "DATABASE") {
    const c = state.database ?? {};
    const obj: Record<string, string | number> = {
      host: c.host ?? "",
      database: c.database ?? "",
      username: c.username ?? "",
    };
    if (c.port != null) obj.port = c.port;
    if (isEdit && !updateSecretKeys.has("password")) {
      obj.password = MASKED;
    } else if (c.password) {
      obj.password = c.password;
    }
    return JSON.stringify(obj);
  }

  if (type === "REST") {
    const c = state.rest ?? {};
    const obj: Record<string, string> = { url: c.url ?? "" };
    if (isEdit && !updateSecretKeys.has("apiKey")) {
      obj.apiKey = MASKED;
    } else if (c.apiKey) {
      obj.apiKey = c.apiKey;
    }
    if (isEdit && !updateSecretKeys.has("token")) {
      obj.token = MASKED;
    } else if (c.token) {
      obj.token = c.token;
    }
    return JSON.stringify(obj);
  }

  return "{}";
}

export function validateConfig(
  type: DataSourceType,
  state: ConfigFormState
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (type === "DATABASE") {
    const c = state.database ?? {};
    if (!c.host?.trim()) errors.host = "Host is required.";
    if (!c.database?.trim()) errors.database = "Database is required.";
    if (!c.username?.trim()) errors.username = "Username is required.";
  }
  if (type === "REST") {
    const c = state.rest ?? {};
    if (!c.url?.trim()) errors.url = "URL is required.";
  }
  if (type === "CSV" || type === "JSON") {
    const path = (state.csv ?? state.json)?.path ?? (state.csv ?? state.json)?.url ?? "";
    if (!String(path).trim()) errors.path = "Path or URL is required.";
  }
  return errors;
}
