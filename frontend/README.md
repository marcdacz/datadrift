# DataDrift Frontend

Scaffold UI for the DataDrift data monitoring and automation platform. Layout, navigation, routing, and theme only — no business logic yet.

## Tech stack

- React 18, TypeScript, Vite
- React Router
- CSS Modules + global CSS variables (no heavy styling framework)

## Run locally

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000). API requests to `/api/*` are proxied to the backend at `http://localhost:8080` — ensure the Spring Boot backend is running for the Dashboard health status.

## Scripts

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint (required before commit; see AGENT.md)
- `npm run lint:fix` — run ESLint with auto-fix
- `npm run test:e2e` — run Playwright E2E tests (starts dev server; run `npx playwright install chromium` once if needed)

## Structure

```
src/
├── app/           # App shell, layout, routing, theme
├── pages/         # Placeholder route pages
├── components/    # Shared UI (e.g. HealthStatus)
├── api/           # API clients
├── styles/        # Global CSS
└── main.tsx       # Entry point
```
