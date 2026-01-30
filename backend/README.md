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
- **Placeholders**: `GET /api/connections`, `/api/views`, `/api/rules`, `/api/executions` → `{"message":"Not implemented yet"}`

## Configuration

- `application.yml`: app name, server port 8080, PostgreSQL datasource, JPA (ddl-auto: validate), Flyway migrations, logging.
- `logback.xml`: console logging for local dev.
- Tests use profile `test` with H2 in-memory (`application-test.yml`); no PostgreSQL needed for `mvn test`.

Credentials in `application.yml` are for local use only; do not use in production.

## Troubleshooting

- **"Found non-empty schema but no schema history table"** — Fixed by `flyway.baseline-on-migrate: true`; the app should start now. If you instead see **"relation system_info already exists"**, the database was created earlier by Hibernate. Drop the table and Flyway metadata, then restart:  
  `psql -U datadrift -d datadrift -c 'DROP TABLE IF EXISTS system_info CASCADE; DROP TABLE IF EXISTS flyway_schema_history CASCADE;'`  
  Or use a fresh database.
