"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isAxiosError } from "axios";

import { useDeleteProperty } from "@/hooks/useLandlordProperty";

import { Button } from "@/components/ui/button";

type DeletePropertyButtonProps = {
  propertyId: number;
  propertyAddress: string;
};

type ApiErrorResponse = {
  message?: string;
};

export default function DeletePropertyButton({
  propertyId,
  propertyAddress,
}: DeletePropertyButtonProps) {
  const router = useRouter();
  const deleteMutation = useDeleteProperty();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete(): Promise<void> {
    setErrorMessage(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete the property at "${propertyAddress}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(propertyId);

      router.replace("/dashboard/landlord/properties");
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Unable to delete the property.",
        );
        return;
      }

      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "Deleting..." : "Delete property"}
      </Button>

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
