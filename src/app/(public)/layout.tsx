"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

type PublicLayoutProps = {
  children: ReactNode;
};

const guestOnlyRoutes = ["/login", "/register"];

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();

  const isGuestOnlyRoute = guestOnlyRoutes.includes(pathname);

  useEffect(() => {
    if (isGuestOnlyRoute && !isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isGuestOnlyRoute, isLoading, router]);

  if (isGuestOnlyRoute && (isLoading || isAuthenticated)) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <p className="text-sm text-muted-foreground">
          Checking your session...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
