import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import type {
  DashboardVisualisation,
  ExecutionLogEntry,
  ReportSummary,
} from "@/types/dashboard";
import {
  fetchDashboardVisualisations,
  fetchExecutionLogs,
  fetchReports,
} from "@/api/dashboard";

type LoadState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export function DashboardPage() {
  const { isAuthenticated, hasRole, user } = useAuth();
  const isAdminOrManager = hasRole(["admin", "manager"]);

  const [isEditing, setIsEditing] = useState(false);
  const [visualisationsState, setVisualisationsState] = useState<
    LoadState<DashboardVisualisation[]>
  >({ data: null, isLoading: true, error: null });
  const [reportsState, setReportsState] = useState<LoadState<ReportSummary[]>>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [executionsState, setExecutionsState] = useState<
    LoadState<ExecutionLogEntry[]>
  >({ data: null, isLoading: true, error: null });
  const [expandedExecutionId, setExpandedExecutionId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function load() {
      setVisualisationsState({ data: null, isLoading: true, error: null });
      setReportsState({ data: null, isLoading: true, error: null });
      setExecutionsState({ data: null, isLoading: true, error: null });

      try {
        const [visualisations, reports, executions] = await Promise.all([
          fetchDashboardVisualisations(),
          fetchReports(),
          isAdminOrManager ? fetchExecutionLogs() : Promise.resolve<ExecutionLogEntry[]>([]),
        ]);

        if (cancelled) return;

        setVisualisationsState({
          data: visualisations,
          isLoading: false,
          error: null,
        });
        setReportsState({
          data: reports,
          isLoading: false,
          error: null,
        });
        setExecutionsState({
          data: executions,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data.";
        setVisualisationsState((prev) => ({
          ...prev,
          isLoading: false,
          error: prev.error ?? message,
        }));
        setReportsState((prev) => ({
          ...prev,
          isLoading: false,
          error: prev.error ?? message,
        }));
        setExecutionsState((prev) => ({
          ...prev,
          isLoading: false,
          error: prev.error ?? message,
        }));
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAdminOrManager]);

  const showVisualisationCtas = isAdminOrManager;
  const visualisations = visualisationsState.data ?? [];
  const reports = reportsState.data ?? [];
  const executionLogs = executionsState.data ?? [];

  const hasAnyError =
    visualisationsState.error || reportsState.error || executionsState.error;

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    // No persistence yet; this is a skeleton for the future edit flow.
    setIsEditing(false);
  };

  const executionStatusLabel: Record<ExecutionLogEntry["status"], string> = {
    success: "Succeeded",
    failed: "Failed",
    pending: "Pending",
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl w-full mx-auto">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Overview of visualisations, reports, and recent automation runs.
          </p>
        </div>
        {isAdminOrManager ? (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Save changes
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleToggleEdit}>
                Edit dashboard
              </Button>
            )}
          </div>
        ) : null}
      </div>

      {hasAnyError ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load dashboard</AlertTitle>
          <AlertDescription>
            {visualisationsState.error ??
              reportsState.error ??
              executionsState.error}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Visualisations</CardTitle>
            <CardDescription>
              Charts and tiles configured for this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visualisationsState.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : visualisations.length === 0 ? (
              <div className="rounded-md border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
                {showVisualisationCtas ? (
                  <div className="space-y-3">
                    <p>
                      You haven&apos;t created any charts yet. Get started by
                      creating your first visualisation.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Add visualisation</Button>
                      <Button variant="outline" size="sm">
                        Add automation
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>
                    Your Data Manager haven&apos;t created any charts yet.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visualisations.map((vis) => (
                  <Card
                    key={vis.id}
                    className={isEditing ? "border-dashed border-primary/70" : ""}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        {vis.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {vis.type.toUpperCase()} visualisation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      <p>
                        Visualisation preview will appear here once data views
                        and chart types are configured.
                      </p>
                      {vis.errorMessage ? (
                        <p className="mt-2 text-xs text-destructive">
                          {vis.errorMessage}
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {isEditing ? (
              <p className="text-xs text-muted-foreground">
                Edit mode is enabled. Drag-and-drop layout and detailed
                visualisation settings will be added here in a future
                iteration.
              </p>
            ) : null}
          </CardContent>
        </Card>

      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Visualisation settings</CardTitle>
            <CardDescription>
              Configure the data view, columns, and visualisation options for
              the selected tile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This is a structural placeholder for the future edit experience.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Data view selection dropdown with quick &ldquo;+&rdquo; add.</li>
              <li>Column selection and aggregation options.</li>
              <li>Per-visualisation settings such as series, labels, and axes.</li>
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Reports shared with or accessible by{" "}
              {user?.name || user?.email || "the current user"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                  <TableCaption className="text-xs text-muted-foreground">
                    Reports appear here once they&apos;re generated and shared
                    with you.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Author
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Created
                      </TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportsState.isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-16 text-center">
                          Loading reports…
                        </TableCell>
                      </TableRow>
                    ) : reports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-16 text-center">
                          No reports yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.name}
                          </TableCell>
                          <TableCell className="hidden max-w-xs truncate md:table-cell">
                            {report.description ?? "—"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {report.author}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {new Date(report.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {report.downloadUrl ? (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                              >
                                <a href={report.downloadUrl}>View / download</a>
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Not available
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
          </CardContent>
        </Card>

        {isAdminOrManager ? (
          <Card>
            <CardHeader>
              <CardTitle>Execution logs</CardTitle>
              <CardDescription>
                Recent automation runs and their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption className="text-xs text-muted-foreground">
                  Execution history for automations configured in this
                  workspace.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date / time</TableHead>
                    <TableHead>Automation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executionsState.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-16 text-center">
                        Loading execution logs…
                      </TableCell>
                    </TableRow>
                  ) : executionLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-16 text-center">
                        No execution logs yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    executionLogs.map((log) => {
                      const isExpanded = expandedExecutionId === log.id;
                      const badgeStatus =
                        log.status === "success"
                          ? "success"
                          : log.status === "failed"
                            ? "error"
                            : "pending";
                      return (
                        <Fragment key={log.id}>
                          <TableRow>
                            <TableCell>
                              {new Date(log.executedAt).toLocaleString()}
                            </TableCell>
                            <TableCell>{log.automationName}</TableCell>
                            <TableCell>
                              <StatusBadge
                                status={badgeStatus}
                                label={executionStatusLabel[log.status]}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              {log.status === "failed" &&
                              (log.errorSummary || log.errorDetails) ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setExpandedExecutionId(
                                      isExpanded ? null : log.id,
                                    )
                                  }
                                >
                                  {isExpanded ? "Hide details" : "View details"}
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                          {isExpanded && log.errorDetails ? (
                            <TableRow>
                              <TableCell colSpan={4}>
                                <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                                  {log.errorDetails}
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
                </Table>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

