"use client";

//import AdminPropertyCard from "@/components/admin/";

import {
  useAdminProperties,
  useUpdateAdminPropertyStatus,
} from "@/hooks/use-admin-properties";

import type { UpdateAdminPropertyStatusPayload } from "@/types/admin";
import AdminPropertyCard from "../../../components/admin/AdminPropertyCard";

export default function AdminPropertiesPage() {
  const { data, isLoading, isError, error } =
    useAdminProperties("PENDING_APPROVAL");

  const updatePropertyStatus = useUpdateAdminPropertyStatus();

  const handleUpdateStatus = (
    propertyId: number,
    status: UpdateAdminPropertyStatusPayload["status"],
  ) => {
    updatePropertyStatus.mutate({
      propertyId,
      status,
    });
  };

  if (isLoading) {
    return (
      <section className="rounded-lg border p-6">
        <p className="text-muted-foreground">Loading pending properties...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-6">
        <h1 className="font-heading text-xl font-semibold text-destructive">
          Failed to load properties
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
      </section>
    );
  }

  const properties = data?.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-3xl font-semibold">
          Pending Properties
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review new property listings submitted by landlords.
        </p>
      </header>

      {updatePropertyStatus.isError && (
        <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {updatePropertyStatus.error instanceof Error
              ? updatePropertyStatus.error.message
              : "The property status could not be updated."}
          </p>
        </section>
      )}

      {properties.length === 0 ? (
        <section className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="font-heading text-lg font-semibold">
            No pending properties
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            All submitted property listings have been reviewed.
          </p>
        </section>
      ) : (
        <section className="space-y-5">
          {properties.map((property) => {
            const isCurrentPropertyUpdating =
              updatePropertyStatus.isPending &&
              updatePropertyStatus.variables?.propertyId ===
                property.property_id;

            return (
              <AdminPropertyCard
                key={property.property_id}
                property={property}
                isUpdating={isCurrentPropertyUpdating}
                onUpdateStatus={handleUpdateStatus}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
