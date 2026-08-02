"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const publicLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/properties",
    label: "Properties",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  function handleLogout(): void {
    logout();
    router.replace("/login");
  }

  return (
    <header className="border-b bg-background">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-heading text-xl font-semibold tracking-tight"
          >
            RentNest
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            {publicLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname.startsWith("/dashboard")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground md:inline">
                {user?.email}
              </span>

              <Button type="button" variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
