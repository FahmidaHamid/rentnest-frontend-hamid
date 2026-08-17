"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useLandlordProperty } from "@/hooks/useLandlordProperty";
import DeletePropertyButton from "@/components/shared/DeletePropertyButton";

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function LandlordPropertyDetailsPage() {
  const params = useParams<{ id: string }>();
  const propertyId = Number(params.id);

  const propertyQuery = useLandlordProperty(propertyId);

  if (propertyQuery.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p>Loading property...</p>
      </main>
    );
  }

  if (propertyQuery.isError || !propertyQuery.data) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-destructive">Unable to load this property.</p>
      </main>
    );
  }

  const property = propertyQuery.data.data;
  const features = property.features;

  // const canModify =
  //   property.status === "AVAILABLE_FOR_RENT" ||
  //   property.status === "IN_MARKET_FOR_SALE";

  const canModify = property.status === "PENDING_APPROVAL";
  const canDelete = property.status === "PENDING_APPROVAL";

  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <Link
            href="/dashboard/landlord/properties"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to my properties
          </Link>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="font-heading text-3xl font-semibold">
                {property.address}
              </h1>

              <p className="mt-2 text-muted-foreground">
                {formatEnumLabel(property.type)}
              </p>
            </div>

            <span className="w-fit rounded-full border px-3 py-1 text-sm font-medium">
              {formatEnumLabel(property.status)}
            </span>
          </div>
        </div>
        {property.property_images.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {property.property_images.map((image) => (
              <div
                key={image.image_id}
                role="img"
                aria-label={`Property at ${property.address}`}
                className="aspect-video rounded-lg border bg-muted bg-cover bg-center"
                style={{
                  backgroundImage: `url("${image.image_url}")`,
                }}
              />
            ))}
          </section>
        )}
        <section className="grid gap-4 rounded-lg border p-6 sm:grid-cols-2 lg:grid-cols-3">
          <p>
            <span className="font-medium">Price:</span> $
            {property.asking_price.toLocaleString()}
          </p>

          <p>
            <span className="font-medium">Category:</span>{" "}
            {formatEnumLabel(property.category)}
          </p>

          <p>
            <span className="font-medium">Bedrooms:</span>{" "}
            {features?.bedrooms ?? 0}
          </p>

          <p>
            <span className="font-medium">Bathrooms:</span>{" "}
            {features?.bathrooms ?? 0}
          </p>

          <p>
            <span className="font-medium">Square feet:</span>{" "}
            {features?.square_feet ?? 0}
          </p>

          <p>
            <span className="font-medium">Parking:</span>{" "}
            {features?.parking_spaces ?? 0}
          </p>

          <p>
            <span className="font-medium">Year built:</span>{" "}
            {features?.year_built ?? "Not provided"}
          </p>

          <p>
            <span className="font-medium">Pets:</span>{" "}
            {features?.pet_allowed ? "Allowed" : "Not allowed"}
          </p>
        </section>

        <section className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {canModify ? (
              <Link
                href={`/dashboard/landlord/properties/${property.property_id}/edit`}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Edit property
              </Link>
            ) : (
              <p className="max-w-xl text-sm text-muted-foreground">
                This property cannot be modified while its current status is{" "}
                {formatEnumLabel(property.status)}.
              </p>
            )}
          </div>

          {/* <DeletePropertyButton
            propertyId={property.property_id}
            propertyAddress={property.address}
          /> */}
          {canDelete && (
            <DeletePropertyButton
              propertyId={property.property_id}
              propertyAddress={property.address}
            />
          )}
        </section>
      </div>
    </main>
  );
}
