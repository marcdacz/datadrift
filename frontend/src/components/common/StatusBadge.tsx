import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusBadgeStatus = "success" | "error" | "pending" | "neutral";

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  label?: string;
  className?: string;
}

const variantMap: Record<StatusBadgeStatus, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  error: "destructive",
  pending: "secondary",
  neutral: "outline",
};

const defaultLabels: Record<StatusBadgeStatus, string> = {
  success: "Success",
  error: "Error",
  pending: "Pending",
  neutral: "—",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = status === "success" ? "default" : variantMap[status];
  const displayLabel = label ?? defaultLabels[status];

  return (
    <Badge
      variant={variant}
      className={cn(
        status === "success" && "bg-emerald-600 hover:bg-emerald-600/90 border-transparent",
        className
      )}
      aria-label="Status"
    >
      {displayLabel}
    </Badge>
  );
}
