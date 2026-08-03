"use client";

import { useQuery } from "@tanstack/react-query";

import PropertyDetails from "@/components/shared/PropertyDetails";

import { getPropertyById } from "@/services/property.service";
//import PropertyRequestButton from "@/components/shared/PropertyRequestButton";

import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function PropertyDetailsPage({ params }: Props) {
  const { id } = React.use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
  });

  if (isLoading) return <p className="p-10">Loading...</p>;

  if (isError || !data) return <p className="p-10">Property not found.</p>;

  return <PropertyDetails property={data} />;
}
