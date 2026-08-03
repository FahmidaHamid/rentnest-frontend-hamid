"use client";

import Image from "next/image";
import { Building2, CalendarDays, Mail, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { AdminPropertyRequest, AdminRequestStatus } from "@/types/admin";
import { cn } from "@/lib/utils";

type AdminRequestCardProps = {
  request: AdminPropertyRequest;
  isUpdating: boolean;
  onUpdateStatus: (requestId: number, status: AdminRequestStatus) => void;
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

function getStatusBadgeClass(status: AdminRequestStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function AdminRequestCard({
  request,
  isUpdating,
  onUpdateStatus,
}: AdminRequestCardProps) {
  const propertyImage =
    request.property.property_images[0]?.image_url ?? PLACEHOLDER_IMAGE;

  const landlordCompany =
    request.property.owner.landlordProfile?.company_name ??
    "Independent landlord";

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative min-h-52 bg-muted md:min-h-full">
          <Image
            src={propertyImage}
            alt={request.property.address}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 220px"
          />
        </div>

        <div>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl">
                  {request.property.address}
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  {request.property.type.replaceAll("_", " ")}
                </p>
              </div>

              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border px-2 py-1 text-xs font-medium"
                >
                  {request.request_type}
                </Badge>
                <Badge
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    getStatusBadgeClass(request.request_status),
                  )}
                >
                  {request.request_status}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    {request.user.first_name} {request.user.last_name}
                  </p>

                  <p className="text-muted-foreground">Tenant</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium">{request.user.email}</p>

                  <p className="text-muted-foreground">Contact email</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building2 className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium">{landlordCompany}</p>

                  <p className="text-muted-foreground">
                    {request.property.owner.first_name}{" "}
                    {request.property.owner.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="font-medium">
                    {formatDate(request.created_at)}
                  </p>

                  <p className="text-muted-foreground">Submitted</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">Asking price</p>

              <p className="text-lg font-semibold">
                {formatPrice(request.property.asking_price)}
                {request.request_type === "RENT" && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / month
                  </span>
                )}
              </p>
            </div>
          </CardContent>

          {request.request_status === "PENDING" && (
            <CardFooter className="justify-end gap-3 border-t pt-4">
              <Button
                variant="outline"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(request.request_id, "REJECTED")}
              >
                Reject
              </Button>

              <Button
                disabled={isUpdating}
                onClick={() => onUpdateStatus(request.request_id, "APPROVED")}
              >
                {isUpdating ? "Updating..." : "Approve"}
              </Button>
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  );
}
