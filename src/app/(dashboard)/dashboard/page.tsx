"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

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
      </div>
    </main>
  );
}
