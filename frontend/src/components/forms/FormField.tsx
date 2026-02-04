import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required,
  error,
  help,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className={required ? "after:content-['_*'] after:text-destructive" : undefined}>
        {label}
      </Label>
      {children}
      {error && (
        <span className="text-xs text-destructive" role="alert">
          {error}
        </span>
      )}
      {help && !error && (
        <span className="text-xs text-muted-foreground">{help}</span>
      )}
    </div>
  );
}
