"use client";

import { useState } from "react";
import { isAxiosError } from "axios";

import AdminReviewCard from "@/components/admin/AdminReviewCard";

import { useAdminReviews, useDeleteAdminReview } from "@/hooks/useReview";

type ApiErrorResponse = {
  message?: string;
};

export default function AdminReviewsPage() {
  const reviewsQuery = useAdminReviews();
  const deleteReviewMutation = useDeleteAdminReview();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete(
    reviewId: number,
    propertyAddress: string,
  ): Promise<void> {
    setErrorMessage(null);

    const confirmed = window.confirm(
      `Delete this review for "${propertyAddress}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(reviewId);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message ?? "Unable to delete the review.",
        );
        return;
      }

      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (reviewsQuery.isPending) {
    return (
      <section className="rounded-lg border p-6">
        <p className="text-muted-foreground">Loading reviews...</p>
      </section>
    );
  }

  if (reviewsQuery.isError) {
    return (
      <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-6">
        <h1 className="text-xl font-semibold text-destructive">
          Failed to load reviews
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {reviewsQuery.error instanceof Error
            ? reviewsQuery.error.message
            : "An unexpected error occurred."}
        </p>
      </section>
    );
  }

  const reviews = reviewsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Review Moderation</h1>

        <p className="mt-2 text-muted-foreground">
          Review and remove inappropriate property comments.
        </p>
      </header>

      {errorMessage && (
        <section
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4"
        >
          <p className="text-sm text-destructive">{errorMessage}</p>
        </section>
      )}

      {reviews.length === 0 ? (
        <section className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="font-semibold">No reviews found</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Tenant property reviews will appear here.
          </p>
        </section>
      ) : (
        <section className="space-y-5">
          {reviews.map((review) => {
            const isCurrentReviewDeleting =
              deleteReviewMutation.isPending &&
              deleteReviewMutation.variables === review.review_id;

            return (
              <AdminReviewCard
                key={review.review_id}
                review={review}
                isDeleting={isCurrentReviewDeleting}
                onDelete={handleDelete}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
