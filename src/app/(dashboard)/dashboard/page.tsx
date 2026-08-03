"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Dashboard</h1>

          <p className="mt-2 text-muted-foreground">
            Welcome to your RentNest account.
          </p>
        </div>

        {user && (
          <section className="rounded-lg border p-6">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>

            <p className="mt-2">
              <span className="font-medium">Roles:</span>{" "}
              {user.roles.join(", ")}
            </p>
          </section>
        )}
        {hasRole("ADMIN") && (
          <section className="rounded-lg border p-6">
            <h2 className="font-heading text-xl font-semibold">Admin tools</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage users, properties, and tenant requests.
            </p>

            <Button className="mt-4" render={<Link href="/admin" />}>
              Open admin dashboard
            </Button>
          </section>
        )}
        {hasRole("LANDLORD") && (
          <section className="rounded-lg border p-6">
            <h2 className="font-heading text-xl font-semibold">
              Landlord tools
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your property listings and incoming requests.
            </p>

            <Button
              className="mt-4"
              render={<Link href="/dashboard/landlord" />}
            >
              Open landlord dashboard
            </Button>
          </section>
        )}

        {hasRole("TENANT") && (
          <section className="rounded-lg border p-6">
            <h2 className="font-heading text-xl font-semibold">Tenant tools</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              View your rent and purchase requests.
            </p>

            <Button
              className="mt-4"
              render={<Link href="/dashboard/tenant/requests" />}
            >
              View my requests
            </Button>
          </section>
        )}
      </div>
    </main>
  );
}
