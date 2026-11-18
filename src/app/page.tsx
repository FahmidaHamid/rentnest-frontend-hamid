import Link from "next/link";
import Image from "next/image";
import RecentlyListedProperties from "@/components/shared/RecentlyListedProperties";


export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Hero content */}
        <div className="space-y-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Welcome to RentNest
          </p>

          <h1 className="font-heading text-5xl leading-tight font-semibold tracking-tight md:text-6xl">
            Find a place to call home.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Discover properties for rent or sale, explore your options, and
            connect with landlords—all in one convenient marketplace.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore Properties
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Your next chapter starts with the right place.
          </p>
        </div>

        {/* Hero image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-xl sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src="/images/rentnest-hero.png"
            alt="Beautiful modern home surrounded by greenery"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>
      <RecentlyListedProperties />
    </main>
  );
}
