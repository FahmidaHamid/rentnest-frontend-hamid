"use client";

import Link from "next/link";

import { useLandlordProperties } from "@/hooks/useLandlordProperty";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { PropertyStatus } from "@/types/property";

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getStatusClassName(status: PropertyStatus): string {
  switch (status) {
    case "PENDING_APPROVAL":
      return "border-amber-200 bg-amber-50 text-amber-800";

    case "AVAILABLE_FOR_RENT":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";

    case "IN_MARKET_FOR_SALE":
      return "border-blue-200 bg-blue-50 text-blue-800";

    case "CURRENTLY_OCCUPIED":
      return "border-violet-200 bg-violet-50 text-violet-800";

    case "RENTED":
      return "border-indigo-200 bg-indigo-50 text-indigo-800";

    case "SOLD":
      return "border-slate-200 bg-slate-100 text-slate-800";

    case "INAVAILABLE_OR_UNKNOWN":
      return "border-red-200 bg-red-50 text-red-800";
  }
}

export default function LandlordPropertiesPage() {
  const propertiesQuery = useLandlordProperties();

  if (propertiesQuery.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <p className="text-muted-foreground">Loading your properties...</p>
      </main>
    );
  }

  if (propertiesQuery.isError) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="text-center">
          <p className="text-destructive">Failed to load your properties.</p>

          <button
            type="button"
            onClick={() => propertiesQuery.refetch()}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const properties = propertiesQuery.data.data;

  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-3xl font-semibold">
              My Properties
            </h1>

            <p className="mt-2 text-muted-foreground">
              View and manage the properties you have submitted.
            </p>
          </div>

          <Link
            href="/dashboard/landlord/properties/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            Add property
          </Link>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No properties yet</CardTitle>

              <CardDescription>
                Add your first property to begin managing your listings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Link
                href="/dashboard/landlord/properties/new"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
              >
                Add your first property
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => {
              const features = property.features;

              const firstImage = property.property_images[0]?.image_url;

              return (
                <Card
                  key={property.property_id}
                  className="overflow-hidden pt-0 transition-shadow hover:shadow-md"
                >
                  <div
                    role="img"
                    aria-label={`Property at ${property.address}`}
                    className={cn(
                      "h-48 w-full bg-muted bg-cover bg-center",
                      !firstImage && "flex items-center justify-center",
                    )}
                    style={
                      firstImage
                        ? {
                            backgroundImage: `url("${firstImage}")`,
                          }
                        : undefined
                    }
                  >
                    {!firstImage && (
                      <span className="text-sm text-muted-foreground">
                        No property image
                      </span>
                    )}
                  </div>

                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <CardTitle className="line-clamp-2 text-lg">
                          {property.address}
                        </CardTitle>

                        <CardDescription className="mt-1">
                          {formatEnumLabel(property.category)}
                          {" · "}
                          {formatEnumLabel(property.type)}
                        </CardDescription>
                      </div>

                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
                          getStatusClassName(property.status),
                        )}
                      >
                        {formatEnumLabel(property.status)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <p className="text-2xl font-semibold">
                      {formatPrice(property.asking_price)}
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Bedrooms</p>

                        <p className="font-medium">{features?.bedrooms ?? 0}</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Bathrooms</p>

                        <p className="font-medium">
                          {features?.bathrooms ?? 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Square feet</p>

                        <p className="font-medium">
                          {(features?.square_feet ?? 0).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Parking</p>

                        <p className="font-medium">
                          {features?.parking_spaces ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <p className="text-xs text-muted-foreground">
                        Added{" "}
                        {new Date(property.created_at).toLocaleDateString()}
                      </p>

                      <Link
                        href={`/dashboard/landlord/properties/${property.property_id}`}
                        className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        View details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
