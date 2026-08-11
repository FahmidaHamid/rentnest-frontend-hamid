"use client";

import { MessageSquareText } from "lucide-react";

import { usePropertyReviews } from "@/hooks/useReview";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PropertyReviewListProps = {
  propertyId: number;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function PropertyReviewList({
  propertyId,
}: PropertyReviewListProps) {
  const reviewsQuery = usePropertyReviews(propertyId);

  if (reviewsQuery.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews and Questions</CardTitle>
          <CardDescription>
            Feedback from tenants interested in this property.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  if (reviewsQuery.isError) {
    return (
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Reviews and Questions</CardTitle>
          <CardDescription>
            Feedback from tenants interested in this property.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            Unable to load reviews for this property.
          </p>
        </CardContent>
      </Card>
    );
  }

  const reviews = reviewsQuery.data.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Reviews and Questions
          {reviews.length > 0 && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({reviews.length})
            </span>
          )}
        </CardTitle>

        <CardDescription>
          Feedback from tenants interested in this property.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {reviews.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <MessageSquareText className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 font-medium">No reviews yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Be the first tenant to share a question or comment about this
              property.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <article
                key={review.review_id}
                className="py-5 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium">
                    {review.user.first_name} {review.user.last_name}
                  </p>

                  <time
                    dateTime={review.created_at}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDate(review.created_at)}
                  </time>
                </div>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
