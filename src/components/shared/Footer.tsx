
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-heading text-2xl font-semibold"
            >
              RentNest
            </Link>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Find a place to call home. Discover properties
              for rent or sale in one convenient marketplace.
            </p>
          </div>

          <div className="sm:justify-self-end">
            <h3 className="font-semibold">Explore</h3>

            <nav className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <Link
                href="/properties"
                className="hover:text-foreground"
              >
                Browse Properties
              </Link>
              <Link href="/login" className="hover:text-foreground">
                Log In
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} RentNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
