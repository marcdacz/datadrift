import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Global layout: header full width on top, content below without a sidebar.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isLoginRoute = location.pathname.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen">
      {isLoginRoute ? null : (
        <div className="flex-shrink-0">
          <Header />
        </div>
      )}
      <main className="flex-1 min-w-0 p-6 bg-background">{children}</main>
    </div>
  );
}
