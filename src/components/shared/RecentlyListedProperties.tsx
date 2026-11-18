"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import PropertyCard from "@/components/shared/PropertyCard";
import { getProperties } from "@/services/property.service";
import { Button } from "@/components/ui/button";

export default function RecentlyListedProperties() {
  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });

  const recentProperties = properties.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Recently Listed Properties
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore the latest homes available for rent or sale.
          </p>
        </div>

        <Link
          href="/properties"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          View All Properties
        </Link>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading properties...</p>
      ) : isError ? (
        <p className="text-muted-foreground">
          Properties are temporarily unavailable.
        </p>
      ) : recentProperties.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <p className="text-muted-foreground">
            No properties are currently available.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentProperties.map((property) => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
