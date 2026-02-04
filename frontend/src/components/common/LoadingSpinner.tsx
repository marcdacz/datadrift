import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSpinnerProps {
  className?: string;
  /** Optional message shown below the skeleton */
  message?: string;
}

export function LoadingSpinner({ className, message }: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <Skeleton className="h-8 w-full max-w-md mx-auto" />
      {message && (
        <p className="mt-4 text-center text-sm text-muted-foreground" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
