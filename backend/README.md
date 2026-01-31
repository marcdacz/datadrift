# DataDrift Backend

## Requirements

- Java 21
- Maven 3.9+
- PostgreSQL (for local dev)

## Local PostgreSQL

Start PostgreSQL with the default credentials used in `application.yml`:

```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=datadrift \
  -e POSTGRES_PASSWORD=datadrift \
  -e POSTGRES_DB=datadrift \
  postgres:16
```

Create the database if it does not exist (Docker image above creates it automatically). Flyway runs on startup and applies migrations from `src/main/resources/db/migration`.

## Build and check

From `backend/`:

```bash
mvn validate   # Spotless + Checkstyle
mvn compile   # Compile
mvn test      # Tests (use H2 in-memory; no PostgreSQL required)
```

## Run

From the repo root:

```bash
mvn -f backend/pom.xml spring-boot:run
```

Or from `backend/`:

```bash
cd backend && mvn spring-boot:run
```

## Verify

- **Health**: `GET http://localhost:8080/api/health` → `{"status":"ok","app":"DataDrift","version":"0.1.0"}`
- **Data sources**: `GET http://localhost:8080/api/data-sources` (list), `POST /api/data-sources` (create). Sensitive config fields are encrypted at rest and masked in API responses.
- **Placeholders**: `GET /api/connections`, `/api/views`, `/api/rules`, `/api/executions` → `{"message":"Not implemented yet"}`

## Configuration

- `application.yml`: app name, server port 8080, PostgreSQL datasource, JPA (ddl-auto: validate), Flyway migrations, logging.
- `logback.xml`: console logging for local dev.
- Tests use profile `test` with H2 in-memory (`application-test.yml`); no PostgreSQL needed for `mvn test`.

Credentials in `application.yml` are for local use only; do not use in production.

### Encryption key (DATADRIFT_ENCRYPTION_KEY)

Data source config stores sensitive values (e.g. database passwords, API tokens) encrypted at rest. The encryption key is required at startup.

- **Purpose**: AES-256-GCM key used to encrypt/decrypt sensitive fields in data source config. If missing or invalid, the application will not start (no silent fallback).
- **Format**: Base64-encoded, 32 bytes after decoding. Generate a key with:
  ```bash
  openssl rand -base64 32
  ```
- **Where to set**:
  - **Environment variable**: `export DATADRIFT_ENCRYPTION_KEY=<your-base64-key>` (recommended for production).
  - **.env file**: Place a `.env` file at the project root (directory from which you run the app). The backend loads `.env` automatically if present. Use `.env.example` as a template; copy to `.env` and replace `REPLACE_ME` with your key. Do not commit `.env`.
- For local runs from `backend/`, either put `.env` in `backend/` or export the variable before `mvn spring-boot:run`.

## Troubleshooting

- **"Found non-empty schema but no schema history table"** — Fixed by `flyway.baseline-on-migrate: true`; the app should start now. If you instead see **"relation system_info already exists"**, the database was created earlier by Hibernate. Drop the table and Flyway metadata, then restart:  
  `psql -U datadrift -d datadrift -c 'DROP TABLE IF EXISTS system_info CASCADE; DROP TABLE IF EXISTS flyway_schema_history CASCADE;'`  
  Or use a fresh database.
