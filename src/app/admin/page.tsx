"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Home,
  HousePlus,
  ShoppingCart,
} from "lucide-react";

import AdminDashboardStatCard from "@/components/admin/AdminDashboardStatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAdminProperties } from "@/hooks/use-admin-properties";
import { useAdminRequests } from "@/hooks/use-admin-requests";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

const linkButtonClassName =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground";

export default function AdminDashboardPage() {
  const allPropertiesQuery = useAdminProperties();

  const pendingPropertiesQuery = useAdminProperties("PENDING_APPROVAL");

  const pendingRequestsQuery = useAdminRequests({
    status: "PENDING",
  });

  const isLoading =
    allPropertiesQuery.isPending ||
    pendingPropertiesQuery.isPending ||
    pendingRequestsQuery.isPending;

  const isError =
    allPropertiesQuery.isError ||
    pendingPropertiesQuery.isError ||
    pendingRequestsQuery.isError;

  if (isLoading) {
    return (
      <section className="rounded-lg border p-6">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </section>
    );
  }

  if (isError) {
    const queryError =
      allPropertiesQuery.error ??
      pendingPropertiesQuery.error ??
      pendingRequestsQuery.error;

    return (
      <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-6">
        <h1 className="text-xl font-semibold text-destructive">
          Failed to load dashboard
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {queryError instanceof Error
            ? queryError.message
            : "Some dashboard information could not be retrieved."}
        </p>
      </section>
    );
  }

  const allProperties = allPropertiesQuery.data?.data ?? [];
  const pendingProperties = pendingPropertiesQuery.data?.data ?? [];
  const pendingRequests = pendingRequestsQuery.data?.data ?? [];

  const rentalProperties = allProperties.filter(
    (property) => property.status === "AVAILABLE_FOR_RENT",
  );

  const saleProperties = allProperties.filter(
    (property) => property.status === "IN_MARKET_FOR_SALE",
  );

  const unavailableProperties = allProperties.filter(
    (property) => property.status === "INAVAILABLE_OR_UNKNOWN",
  );

  const reviewedProperties = allProperties.length - pendingProperties.length;

  const recentPendingProperties = [...pendingProperties]
    .sort(
      (firstProperty, secondProperty) =>
        new Date(secondProperty.created_at).getTime() -
        new Date(firstProperty.created_at).getTime(),
    )
    .slice(0, 4);

  const recentPendingRequests = [...pendingRequests]
    .sort(
      (firstRequest, secondRequest) =>
        new Date(secondRequest.created_at).getTime() -
        new Date(firstRequest.created_at).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Monitor RentNest activity and review pending property listings and
          tenant requests.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminDashboardStatCard
          title="Total Properties"
          value={allProperties.length}
          description="All properties registered in RentNest"
          icon={Home}
        />

        <AdminDashboardStatCard
          title="Pending Properties"
          value={pendingProperties.length}
          description="Listings awaiting admin moderation"
          icon={Building2}
        />

        <AdminDashboardStatCard
          title="Pending Requests"
          value={pendingRequests.length}
          description="Tenant requests awaiting review"
          icon={ClipboardList}
        />

        <AdminDashboardStatCard
          title="Available for Rent"
          value={rentalProperties.length}
          description="Approved rental listings"
          icon={HousePlus}
        />

        <AdminDashboardStatCard
          title="Available for Sale"
          value={saleProperties.length}
          description="Approved sale listings"
          icon={ShoppingCart}
        />

        <AdminDashboardStatCard
          title="Reviewed Properties"
          value={reviewedProperties}
          description={`${unavailableProperties.length} currently unavailable`}
          icon={CheckCircle2}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Pending Properties</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Recent landlord listings requiring moderation.
              </p>
            </div>

            <Link href="/admin/properties" className={linkButtonClassName}>
              View all
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </CardHeader>

          <CardContent>
            {recentPendingProperties.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No pending properties</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  All submitted property listings have been reviewed.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentPendingProperties.map((property) => (
                  <div
                    key={property.property_id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{property.address}</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatEnumLabel(property.type)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Submitted by {property.owner.first_name}{" "}
                        {property.owner.last_name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(property.created_at)}
                      </p>
                    </div>

                    <div className="shrink-0 sm:text-right">
                      <p className="font-semibold">
                        {formatPrice(property.asking_price)}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatEnumLabel(property.category)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Pending Tenant Requests</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Recent rent and purchase requests requiring review.
              </p>
            </div>

            <Link href="/admin/requests" className={linkButtonClassName}>
              View all
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </CardHeader>

          <CardContent>
            {recentPendingRequests.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No pending requests</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  All tenant requests have been reviewed.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentPendingRequests.map((request) => (
                  <div
                    key={request.request_id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {request.property.address}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.user.first_name} {request.user.last_name}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {request.user.email}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(request.created_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      <span className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium">
                        {formatEnumLabel(request.request_type)}
                      </span>

                      <p className="text-sm font-semibold">
                        {formatPrice(request.property.asking_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Open the full moderation queues.
            </p>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            <Link href="/admin/properties" className={linkButtonClassName}>
              Review Properties
              <ArrowRight className="ml-2 size-4" />
            </Link>

            <Link href="/admin/requests" className={linkButtonClassName}>
              Review Requests
              <ArrowRight className="ml-2 size-4" />
            </Link>

            <Link href="/properties" className={linkButtonClassName}>
              View Public Listings
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
