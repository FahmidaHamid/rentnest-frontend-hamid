import PropertyCard from "@/components/shared/PropertyCard";
import { properties } from "@/constants/properties";
import PropertyFilter from "@/components/shared/PropertyFilter";
export default function PropertiesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section>
        <h1 className="text-4xl font-bold">Browse Properties</h1>

        <p className="mt-2 text-gray-600">
          Find your next home from available rentals.
        </p>
      </section>

      <section className="mt-10">
        <div className="grid gap-6 md:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
      <section className="m-2 p-3">
        <h1 className="text-4xl font-bold">Browse Properties</h1>

        <p className="mt-2 text-gray-600">
          Find your next home from available rentals.
        </p>

        <PropertyFilter />
      </section>
    </main>
  );
}
