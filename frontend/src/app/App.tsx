import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { AppRoutes } from "./routing/AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

/**
 * Root app component. Wires layout, routing, and TanStack Query.
 * TODO: Add error boundary, auth provider when needed.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
