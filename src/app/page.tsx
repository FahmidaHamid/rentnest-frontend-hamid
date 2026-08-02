import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold">
          Find your perfect property with RentNest
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Browse properties for rent or sale and connect with landlords through
          one secure marketplace.
        </p>

        <div className="mt-8">
          <Link href="/properties">
            <Button>Browse properties</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
