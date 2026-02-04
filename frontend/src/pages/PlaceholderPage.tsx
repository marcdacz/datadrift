import type { ReactNode } from "react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </header>
      {children ?? (
        <div
          className="rounded-lg border border-dashed border-border/60 bg-muted/40 px-6 py-10 text-sm text-muted-foreground"
          aria-hidden
        >
          Content area — placeholder
        </div>
      )}
    </section>
  );
}
