# AGENT.md

## Purpose

This document defines mandatory engineering standards for this repository. All human and AI-generated code must comply with these rules. Builds, tests, and commits are expected to fail if standards are violated.

**Goals:**

- Consistency across backend and frontend
- High signal-to-noise codebases
- Predictable AI-assisted generation
- Low cognitive overhead when reviewing or extending code

This is a **single-tenant application**.

---

## Core Architectural Principles

### 1. Single-Tenant Architecture

- One deployment = one organization
- One database per deployment
- No tenant identifiers (`tenant_id`) anywhere in the system
- All users belong to the same logical system

### 2. Separation of Concerns

Backend must follow a strict layered architecture:

**Controller → Service → Repository → Database**

**Rules:**

- Controllers contain no business logic
- Services contain all business logic
- Repositories contain no logic beyond persistence
- No layer skipping

### 3. Bounded Contexts

Each feature module owns its full vertical slice:

- Entity
- Repository
- Service
- Controller
- Tests

Cross-module access is allowed only via public service interfaces.

---

## Backend Standards (Java / Spring Boot)

### 1. Language & Tooling

- Java 17+
- Spring Boot
- Maven
- PostgreSQL
- DuckDB (embedded, in-memory)

### 2. Coding Style (Mandatory)

**Formatting**

- Follow Google Java Style Guide
- Enforced via Checkstyle and Spotless

**Indentation & Line Length**

- 4 spaces per indentation level
- No tabs
- Maximum line length: 120 characters

**Braces**

- Egyptian-style braces
- Braces are mandatory for all control flow statements, including single-line blocks

```java
if (condition) {
    doSomething();
}
```

### 3. Naming Conventions

| Element              | Convention       | Example               |
| -------------------- | ---------------- | --------------------- |
| Classes / Interfaces | PascalCase       | `AutomationRuleService` |
| Methods              | camelCase        | `executeRule()`       |
| Variables            | camelCase        | `executionResult`     |
| Constants            | UPPER_SNAKE_CASE | `DEFAULT_TIMEOUT`     |
| Packages             | lowercase        | `automation.engine`   |

### 4. Immutability Rules

- All method parameters must be `final`
- Prefer immutability for fields where possible
- Avoid setters unless required by frameworks

```java
public void executeRule(final UUID ruleId) {
    // ...
}
```

### 5. Member Ordering (Mandatory)

Class members must be ordered as:

1. Static fields
2. Instance fields
3. Constructors
4. Methods (grouped by functionality)

### 6. Dependency Injection

- Constructor injection only
- No field injection
- No static access to Spring beans

```java
public AutomationService(final RuleRepository ruleRepository) {
    this.ruleRepository = ruleRepository;
}
```

### 7. Exception Handling

- No generic `Exception` catching
- Use domain-specific exceptions
- Controllers must translate exceptions into proper HTTP responses
- Never expose stack traces or internal errors to API clients

### 8. Logging

- Use SLF4J
- Log meaningful events only
- No logging inside tight loops
- No sensitive data in logs (passwords, tokens, secrets)

---

## Database Standards (PostgreSQL)

### 1. Schema Rules

- UUIDs as primary keys
- Snake_case for table and column names
- Foreign keys must be explicitly defined
- Index foreign keys and commonly filtered columns

### 2. JSONB Usage

JSONB is allowed only for:

- Automation rule conditions
- Automation rule actions
- Template payloads

**Rules:**

- JSONB structures must be versioned
- Parsing logic must handle missing or unknown fields gracefully

### 3. Migrations

- Use Flyway or Liquibase
- No manual schema changes
- Migrations must be deterministic and reversible where possible

---

## Automation Engine Standards

### 1. Execution Model

- Synchronous execution (MVP)
- One rule execution must not block others indefinitely
- Failures must be isolated per execution

### 2. Determinism

- Same input data must always produce the same output
- No hidden side effects
- External calls must be explicit actions

### 3. Audit Logging

Every automation execution must produce an audit log record containing:

- Rule name
- Execution timestamp
- Status (SUCCESS / FAILED)
- Error message (if failed)

**Audit logging is non-optional.**

---

## SQL Execution (DuckDB)

### 1. Rules

- DuckDB runs in-memory only
- No persistent DuckDB files
- Data must be normalized into DuckDB tables before querying

### 2. Supported Sources

- CSV (local path)
- JSON (local path)
- REST API (HTTP fetch → JSON → table)
- JDBC database tables

### 3. Safety

- SQL must be validated before execution
- Timeouts must be enforced
- Resource usage must be bounded

---

## Frontend Standards (React / TypeScript)

### 1. Technology Stack

- React
- TypeScript
- Vite
- Playwright (E2E)

### 2. Component Rules

- Functional components only
- One component per file
- Clear separation between:
  - Pages
  - Components
  - Services (API calls)

### 3. State Management

- Local component state preferred
- No global state library for MVP
- Lift state only when necessary

### 4. Error Handling

All API calls must handle:

- Loading
- Error
- Empty states

### 5. Theming

- Light and Dark themes supported
- Respect system preferences

---

## Testing Standards

### 1. Backend Testing

**Unit Tests**

- JUnit 5
- Test business logic only
- Naming convention: `methodName__when__then`

**REST Tests**

- Rest Assured
- Validate:
  - HTTP status
  - Response body
  - Error cases

### 2. Frontend E2E Tests

- Playwright
- Naming convention: `page__when__then`

Tests must cover:

- Happy path
- Validation errors
- Authorization restrictions

---

## DevLoop (ddmake)

**Supported Commands**

- `ddmake cleanall`
- `ddmake install`
- `ddmake run`
- `ddmake run --watch`
- `ddmake run --clean-db`
- `ddmake test`
- `ddmake test --unit --integration --e2e`
- `ddmake check`

---

## Pre-Commit Hooks (Mandatory)

Before any commit:

- Backend formatting and linting must pass
- Frontend linting must pass
- Tests may be optionally skipped locally but must pass in CI

**Commits that violate standards are not acceptable.**

---

## AI Usage Rules

When generating code using AI:

- Always provide AGENT.md as context
- Generate small, focused units of code
- Never generate cross-module changes in one prompt
- Always request tests alongside implementation

AI-generated code is held to the same standards as human-written code.

---

## Final Rule

If it's not defined here, assume the simplest, most explicit, and most maintainable option.

**Standards are not suggestions. They are part of the system design.**
