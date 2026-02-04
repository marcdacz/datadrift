import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateAction {
  label: string;
  to?: string;
  onClick?: () => void;
  primary?: boolean;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions = [],
  children,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-2">
        {Icon && (
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </CardHeader>
      {(description || actions.length > 0 || children) && (
        <CardContent className="text-center pt-0">
          {description && (
            <p className="mb-6 max-w-md mx-auto text-sm text-muted-foreground">
              {description}
            </p>
          )}
          {actions.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {actions.map((action) => {
                const content = action.label;
                if (action.to) {
                  return (
                    <Button key={action.label} asChild variant={action.primary ? "default" : "outline"}>
                      <Link to={action.to}>{content}</Link>
                    </Button>
                  );
                }
                return (
                  <Button
                    key={action.label}
                    variant={action.primary ? "default" : "outline"}
                    onClick={action.onClick}
                  >
                    {content}
                  </Button>
                );
              })}
            </div>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
}
