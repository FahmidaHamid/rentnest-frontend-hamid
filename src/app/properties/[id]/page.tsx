"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import PropertyDetails from "@/components/shared/PropertyDetails";
import PropertyReviewForm from "@/components/review/PropertyReviewForm";
import PropertyReviewList from "@/components/review/PropertyReviewList";

import { getPropertyById } from "@/services/property.service";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function PropertyDetailsPage({ params }: Props) {
  const { id } = React.use(params);
  const propertyId = Number(id);

  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
    enabled: Number.isInteger(propertyId) && propertyId > 0,
  });

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    return <p className="p-10">Invalid property ID.</p>;
  }

  if (isLoading) {
    return <p className="p-10">Loading property...</p>;
  }

  if (isError || !data) {
    return <p className="p-10">Property not found.</p>;
  }

  const isTenant = user?.roles?.includes("TENANT") ?? false;

  return (
    <main className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <PropertyDetails property={data} />

        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <PropertyReviewList propertyId={propertyId} />

          <div>
            {isTenant ? (
              <PropertyReviewForm propertyId={propertyId} />
            ) : (
              <div className="rounded-lg border border-dashed p-6">
                <h2 className="font-semibold">Interested in this property?</h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in with a tenant account to leave a review or ask a
                  question.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
