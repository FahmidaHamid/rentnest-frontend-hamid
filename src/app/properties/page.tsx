"use client";

import { useQuery } from "@tanstack/react-query";

import PropertyCard from "@/components/shared/PropertyCard";
import PropertyFilter from "@/components/shared/PropertyFilter";
import { getProperties } from "@/services/property.service";

export default function PropertiesPage() {
  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p>Loading properties...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold text-red-600">
          Unable to load properties
        </h1>

        <p className="mt-2 text-gray-600">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section>
        <h1 className="text-4xl font-bold">Browse Properties</h1>

        <p className="mt-2 text-gray-600">
          Find your next home from available properties.
        </p>

        <PropertyFilter />
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Available Properties</h2>

          <p className="text-sm text-gray-500">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"} found
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-lg border p-10 text-center">
            <h3 className="text-xl font-semibold">No properties found</h3>

            <p className="mt-2 text-gray-500">
              There are currently no available properties.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.property_id} property={property} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
