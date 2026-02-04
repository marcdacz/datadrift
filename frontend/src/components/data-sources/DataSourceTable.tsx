import { Link } from "react-router-dom";
import type { DataSource } from "../../types/dataSources";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";

interface DataSourceTableProps {
  dataSources: DataSource[];
  onTestConnection: (id: string) => void;
  onDelete: (id: string) => void;
  isTestingId: string | null;
  isDeletingId: string | null;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function DataSourceTable({
  dataSources,
  onTestConnection,
  onDelete,
  isTestingId,
  isDeletingId,
}: DataSourceTableProps) {
  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last tested</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSources.map((ds) => (
            <TableRow key={ds.id}>
              <TableCell>
                <Link
                  to={`/data-sources/${ds.id}/edit`}
                  className="font-medium text-primary hover:underline"
                  aria-label={`Edit ${ds.name}`}
                >
                  {ds.name}
                </Link>
              </TableCell>
              <TableCell>{ds.type}</TableCell>
              <TableCell>
                <StatusBadge status="neutral" />
              </TableCell>
              <TableCell>{formatDate(ds.updatedAt)}</TableCell>
              <TableCell>{formatDate(ds.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/data-sources/${ds.id}/edit`} aria-label={`Edit ${ds.name}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTestConnection(ds.id)}
                    disabled={isTestingId === ds.id}
                    aria-label={`Test connection for ${ds.name}`}
                  >
                    {isTestingId === ds.id ? "Testing…" : "Test connection"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(ds.id)}
                    disabled={isDeletingId === ds.id}
                    aria-label={`Delete ${ds.name}`}
                  >
                    {isDeletingId === ds.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
