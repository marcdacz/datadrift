import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { AppRoutes } from "./routing/AppRoutes";
import { AuthProvider } from "./auth/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

/**
 * Root app component. Wires layout, routing, TanStack Query, and auth provider.
 * TODO: Add error boundary when needed.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
