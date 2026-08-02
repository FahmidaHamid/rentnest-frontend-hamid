// import Navbar from "@/components/shared/NavBar";
// import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/shared/PropertyCard";
import { properties } from "@/constants/properties";

export default function Home() {
  return (
    <main>
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-bold">Find your perfect rental home</h1>

        <p className="mt-4 text-gray-600">
          RentNest connects tenants and landlords in a simple and secure way.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 text-3xl font-bold">Featured Properties</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}
