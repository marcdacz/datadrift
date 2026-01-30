import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { AppRoutes } from "./routing/AppRoutes";

/**
 * Root app component. Wires layout and routing.
 * TODO: Add error boundary, auth provider when needed.
 */
export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}
