"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";

import { useTenantRequests } from "@/hooks/useTenantRequests";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TenantDashboardPage() {
  const requestsQuery = useTenantRequests();

  if (requestsQuery.isPending) {
    return (
      <section className="rounded-lg border p-6">
        <p className="text-muted-foreground">Loading tenant dashboard...</p>
      </section>
    );
  }

  if (requestsQuery.isError) {
    return (
      <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-6">
        <h1 className="text-xl font-semibold text-destructive">
          Failed to load dashboard
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Your property requests could not be retrieved.
        </p>
      </section>
    );
  }

  const requests = requestsQuery.data.data;

  const pendingRequests = requests.filter(
    (request) => request.request_status === "PENDING",
  );

  const approvedRequests = requests.filter(
    (request) => request.request_status === "APPROVED",
  );

  const rejectedRequests = requests.filter(
    (request) => request.request_status === "REJECTED",
  );

  const recentRequests = [...requests]
    .sort(
      (firstRequest, secondRequest) =>
        new Date(secondRequest.created_at).getTime() -
        new Date(firstRequest.created_at).getTime(),
    )
    .slice(0, 3);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="font-heading text-3xl font-semibold">
            Tenant Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Track your rent and purchase requests.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>

              <FileText className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{requests.length}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                All submitted requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>

              <Clock3 className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{pendingRequests.length}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Awaiting admin review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>

              <CheckCircle2 className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{approvedRequests.length}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Eligible for the next step
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>

              <XCircle className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{rejectedRequests.length}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Requests not approved
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Recent Requests</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your most recently submitted property requests.
              </p>
            </div>

            {/* <Button
              variant="outline"
              size="sm"
              render={<Link href="/tenant/requests" />}
            >
              View all
              <ArrowRight className="ml-2 size-4" />
            </Button> */}
            <Link
              href="/dashboard/tenant/requests"
              className="inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View all
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </CardHeader>

          <CardContent>
            {recentRequests.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No property requests</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Browse available properties to submit your first request.
                </p>

                <Button className="mt-4" render={<Link href="/properties" />}>
                  Browse properties
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentRequests.map((request) => (
                  <div
                    key={request.request_id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {request.property.address}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatEnumLabel(request.request_type)} request
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Submitted{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-semibold">
                        {formatPrice(request.property.asking_price)}
                      </p>

                      <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                        {formatEnumLabel(request.request_status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
