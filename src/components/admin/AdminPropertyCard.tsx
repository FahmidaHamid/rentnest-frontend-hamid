// src/components/admin/AdminPropertyCard.tsx

"use client";

import Image from "next/image";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Mail,
  PawPrint,
  Ruler,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

import type { AdminProperty, AdminPropertyStatus } from "@/types/admin";

type ModerationStatus =
  | "AVAILABLE_FOR_RENT"
  | "IN_MARKET_FOR_SALE"
  | "INAVAILABLE_OR_UNKNOWN";

type AdminPropertyCardProps = {
  property: AdminProperty;
  isUpdating: boolean;
  onUpdateStatus: (propertyId: number, status: ModerationStatus) => void;
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function getStatusBadgeClass(status: AdminPropertyStatus) {
  switch (status) {
    case "AVAILABLE_FOR_RENT":
      return "bg-green-100 text-green-700";

    case "IN_MARKET_FOR_SALE":
      return "bg-blue-100 text-blue-700";

    case "INAVAILABLE_OR_UNKNOWN":
      return "bg-red-100 text-red-700";

    case "PENDING_APPROVAL":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function AdminPropertyCard({
  property,
  isUpdating,
  onUpdateStatus,
}: AdminPropertyCardProps) {
  const propertyImage =
    property.property_images[0]?.image_url ?? PLACEHOLDER_IMAGE;

  const landlordCompany =
    property.owner.landlordProfile?.company_name ?? "Independent landlord";

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[240px_1fr]">
        <div className="relative min-h-56 bg-muted md:min-h-full">
          <Image
            src={propertyImage}
            alt={property.address}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 240px"
          />
        </div>

        <div>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl">{property.address}</CardTitle>

                <p className="text-sm text-muted-foreground">
                  {formatLabel(property.type)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{property.category}</Badge>

                <Badge
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    getStatusBadgeClass(property.status),
                  )}
                >
                  {formatLabel(property.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    {property.owner.first_name} {property.owner.last_name}
                  </p>

                  <p className="text-muted-foreground">Landlord</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium break-all">
                    {property.owner.email}
                  </p>

                  <p className="text-muted-foreground">Contact email</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building2 className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium">{landlordCompany}</p>

                  <p className="text-muted-foreground">Company</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    {formatDate(property.created_at)}
                  </p>

                  <p className="text-muted-foreground">Submitted</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">Asking price</p>

              <p className="text-lg font-semibold">
                {formatPrice(property.asking_price)}
              </p>
            </div>

            {property.features && (
              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2">
                  <BedDouble className="size-4 text-muted-foreground" />
                  <span>{property.features.bedrooms} bedrooms</span>
                </div>

                <div className="flex items-center gap-2">
                  <Bath className="size-4 text-muted-foreground" />
                  <span>{property.features.bathrooms} bathrooms</span>
                </div>

                <div className="flex items-center gap-2">
                  <Ruler className="size-4 text-muted-foreground" />
                  <span>
                    {property.features.square_feet.toLocaleString()} sq ft
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Car className="size-4 text-muted-foreground" />
                  <span>{property.features.parking_spaces} parking</span>
                </div>

                <div className="flex items-center gap-2">
                  <PawPrint className="size-4 text-muted-foreground" />
                  <span>
                    {property.features.pet_allowed ? "Pets allowed" : "No pets"}
                  </span>
                </div>

                {property.features.year_built && (
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span>Built in {property.features.year_built}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {property.status === "PENDING_APPROVAL" && (
            <CardFooter className="flex flex-wrap justify-end gap-3 border-t pt-4">
              <Button
                variant="outline"
                disabled={isUpdating}
                onClick={() =>
                  onUpdateStatus(property.property_id, "INAVAILABLE_OR_UNKNOWN")
                }
              >
                Reject
              </Button>

              <Button
                variant="outline"
                disabled={isUpdating}
                onClick={() =>
                  onUpdateStatus(property.property_id, "IN_MARKET_FOR_SALE")
                }
              >
                Approve for Sale
              </Button>

              <Button
                disabled={isUpdating}
                onClick={() =>
                  onUpdateStatus(property.property_id, "AVAILABLE_FOR_RENT")
                }
              >
                {isUpdating ? "Updating..." : "Approve for Rent"}
              </Button>
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  );
}
