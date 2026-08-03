"use client";

import AdminRequestCard from "@/components/admin/AdminRequestCard";
import {
  useAdminRequests,
  useUpdateRequestStatus,
} from "@/hooks/use-admin-requests";

import type { AdminRequestStatus } from "@/types/admin";

export default function AdminRequestsPage() {
  const { data, isLoading, isError, error } = useAdminRequests({
    status: "PENDING",
  });

  const updateRequestStatus = useUpdateRequestStatus();

  const handleUpdateStatus = (
    requestId: number,
    status: AdminRequestStatus,
  ) => {
    updateRequestStatus.mutate({
      requestId,
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">Loading pending requests...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6">
        <p className="font-medium text-destructive">Failed to load requests</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  const requests = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Requests</h1>

        <p className="mt-1 text-muted-foreground">
          Review tenant rent and purchase requests.
        </p>
      </div>

      {updateRequestStatus.isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {updateRequestStatus.error instanceof Error
              ? updateRequestStatus.error.message
              : "Could not update the request."}
          </p>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="font-semibold">No pending requests</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            All tenant requests have been reviewed.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((request) => (
            <AdminRequestCard
              key={request.request_id}
              request={request}
              isUpdating={
                updateRequestStatus.isPending &&
                updateRequestStatus.variables?.requestId === request.request_id
              }
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
