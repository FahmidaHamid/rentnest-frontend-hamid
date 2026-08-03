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
      <section className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Loading pending tenant requests...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-6">
        <h1 className="font-heading text-xl font-semibold text-destructive">
          Failed to load requests
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
      </section>
    );
  }

  const requests = data?.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-3xl font-semibold">
          Pending Tenant Requests
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review pending rent and purchase requests submitted by tenants.
        </p>
      </header>

      {updateRequestStatus.isError && (
        <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {updateRequestStatus.error instanceof Error
              ? updateRequestStatus.error.message
              : "The request status could not be updated."}
          </p>
        </section>
      )}

      {requests.length === 0 ? (
        <section className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="font-heading text-lg font-semibold">
            No pending requests
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            All tenant requests have been reviewed.
          </p>
        </section>
      ) : (
        <section className="space-y-5">
          {requests.map((request) => {
            const isCurrentRequestUpdating =
              updateRequestStatus.isPending &&
              updateRequestStatus.variables?.requestId === request.request_id;

            return (
              <AdminRequestCard
                key={request.request_id}
                request={request}
                isUpdating={isCurrentRequestUpdating}
                onUpdateStatus={handleUpdateStatus}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
