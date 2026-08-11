"use client";

import Link from "next/link";
import { useState } from "react";
import { isAxiosError } from "axios";

import {
  useDeletePropertyRequest,
  useTenantRequests,
} from "@/hooks/useTenantRequests";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { RequestStatus } from "@/types/request";
import PaymentAction from "@/components/payments/PaymentAction";

type ApiErrorResponse = {
  message?: string;
};

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClassName(status: RequestStatus): string {
  switch (status) {
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-800";

    case "APPROVED":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";

    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-800";
  }
}

export default function TenantRequestsPage() {
  const requestsQuery = useTenantRequests();
  const deleteMutation = useDeletePropertyRequest();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCancel(
    requestId: number,
    propertyAddress: string,
  ): Promise<void> {
    setErrorMessage(null);

    const confirmed = window.confirm(
      `Cancel your request for "${propertyAddress}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(requestId);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Unable to cancel the request.",
        );
        return;
      }

      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (requestsQuery.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading your requests...</p>
      </main>
    );
  }

  if (requestsQuery.isError) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-destructive">Unable to load your requests.</p>
      </main>
    );
  }

  const requests = requestsQuery.data.data;

  return (
    <main className="flex-1 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold">
            My Property Requests
          </h1>

          <p className="mt-2 text-muted-foreground">
            Review your rent and purchase requests.
          </p>
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        {requests.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No property requests</CardTitle>

              <CardDescription>
                Browse available properties and submit a rent or purchase
                request.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button render={<Link href="/properties" />}>
                Browse properties
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {requests.map((request) => {
              const property = request.property;
              const firstImage = property.property_images[0]?.image_url;

              return (
                <Card key={request.request_id} className="overflow-hidden pt-0">
                  <div
                    className="h-44 bg-muted bg-cover bg-center"
                    style={
                      firstImage
                        ? {
                            backgroundImage: `url("${firstImage}")`,
                          }
                        : undefined
                    }
                  />

                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle>{property.address}</CardTitle>

                        <CardDescription>
                          Request to{" "}
                          {request.request_type === "RENT" ? "rent" : "buy"}
                        </CardDescription>
                      </div>

                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs font-medium",
                          getStatusClassName(request.request_status),
                        )}
                      >
                        {formatEnumLabel(request.request_status)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-lg font-semibold">
                      ${property.asking_price.toLocaleString()}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Submitted{" "}
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/properties/${property.property_id}`}
                        className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
                      >
                        View property
                      </Link>

                      {request.request_status === "PENDING" && (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={deleteMutation.isPending}
                          onClick={() =>
                            handleCancel(request.request_id, property.address)
                          }
                        >
                          {deleteMutation.isPending
                            ? "Cancelling..."
                            : "Cancel request"}
                        </Button>
                      )}
                      {request.request_status === "APPROVED" && (
                        <PaymentAction requestId={request.request_id} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
