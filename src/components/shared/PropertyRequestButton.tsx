"use client";

import Link from "next/link";
import { useState } from "react";
import { isAxiosError } from "axios";

import { useAuth } from "@/hooks/useAuth";
import { useCreatePropertyRequest } from "@/hooks/useTenantRequests";

import { Button } from "@/components/ui/button";

import type { PropertyStatus } from "@/types/property";
import type { RequestType } from "@/types/request";

type PropertyRequestButtonProps = {
  propertyId: number;
  propertyStatus: PropertyStatus;
};

type ApiErrorResponse = {
  message?: string;
};

export default function PropertyRequestButton({
  propertyId,
  propertyStatus,
}: PropertyRequestButtonProps) {
  const { isAuthenticated, hasRole } = useAuth();

  const requestMutation = useCreatePropertyRequest();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestType: RequestType | null =
    propertyStatus === "AVAILABLE_FOR_RENT"
      ? "RENT"
      : propertyStatus === "IN_MARKET_FOR_SALE"
        ? "BUY"
        : null;

  async function handleRequest(): Promise<void> {
    if (!requestType) {
      return;
    }

    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await requestMutation.mutateAsync({
        property_id: propertyId,
        request_type: requestType,
      });

      setSuccessMessage(response.message);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Unable to submit your request.",
        );
        return;
      }

      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (!requestType) {
    return (
      <p className="text-sm text-muted-foreground">
        This property is not currently accepting requests.
      </p>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        render={
          <Link
            href={`/login?redirect=${encodeURIComponent(
              `/properties/${propertyId}`,
            )}`}
          />
        }
      >
        Log in to request
      </Button>
    );
  }

  if (!hasRole("TENANT")) {
    return (
      <p className="text-sm text-muted-foreground">
        A tenant profile is required to submit a property request.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={handleRequest}
        disabled={requestMutation.isPending}
      >
        {requestMutation.isPending
          ? "Submitting..."
          : requestType === "RENT"
            ? "RENT"
            : "BUY"}
      </Button>

      {successMessage && (
        <p role="status" className="text-sm text-emerald-700">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
