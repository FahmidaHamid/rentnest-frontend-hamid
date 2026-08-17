"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import EditPropertyForm from "@/components/forms/EditPropertyForm";
import { useLandlordProperty } from "@/hooks/useLandlordProperty";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const propertyId = Number(params.id);

  const propertyQuery = useLandlordProperty(propertyId);

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <p className="text-destructive">Invalid property ID.</p>
      </main>
    );
  }

  if (propertyQuery.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <p className="text-muted-foreground">Loading property...</p>
      </main>
    );
  }

  if (propertyQuery.isError || !propertyQuery.data) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <p className="text-destructive">Unable to load this property.</p>
      </main>
    );
  }

  const property = propertyQuery.data.data;

  // const canModify =
  //   property.status === "AVAILABLE_FOR_RENT" ||
  //   property.status === "IN_MARKET_FOR_SALE";
  const canModify = property.status === "PENDING_APPROVAL";

  if (!canModify) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-lg text-center">
          <h1 className="font-heading text-2xl font-semibold">
            Property cannot be edited
          </h1>

          <p className="mt-3 text-muted-foreground">
            This property cannot be modified while its current status is{" "}
            {property.status.toLowerCase().replaceAll("_", " ")}.
          </p>

          <Link
            href={`/dashboard/landlord/properties/${property.property_id}`}
            className="mt-6 inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
          >
            Return to property
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-10 sm:px-6">
      <EditPropertyForm property={property} />
    </main>
  );
}
