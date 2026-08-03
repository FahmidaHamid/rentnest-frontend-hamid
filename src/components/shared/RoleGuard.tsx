"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

import type { UserRole } from "@/types/auth";

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
};

export default function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = "/dashboard",
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  const hasPermission =
    user?.roles.some((role) => allowedRoles.includes(role)) ?? false;

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasPermission) {
      router.replace(fallbackPath);
    }
  }, [fallbackPath, hasPermission, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <p className="text-sm text-muted-foreground">Checking permissions...</p>
      </main>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
