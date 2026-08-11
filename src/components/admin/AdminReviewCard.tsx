"use client";

import Link from "next/link";
import {
  CalendarDays,
  Mail,
  MessageSquareText,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Review } from "@/types/review";

type AdminReviewCardProps = {
  review: Review;
  isDeleting: boolean;
  onDelete: (reviewId: number, propertyAddress: string) => void;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminReviewCard({
  review,
  isDeleting,
  onDelete,
}: AdminReviewCardProps) {
  const reviewerName = `${review.user.first_name} ${review.user.last_name}`;

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-lg">
              Review #{review.review_id}
            </CardTitle>

            <Link
              href={`/properties/${review.property.property_id}`}
              className="mt-1 block truncate text-sm font-medium text-primary hover:underline"
            >
              {review.property.address}
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-4" />
            <time dateTime={review.created_at}>
              {formatDate(review.created_at)}
            </time>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <User className="mt-0.5 size-4 text-muted-foreground" />

            <div>
              <p className="font-medium">{reviewerName}</p>
              <p className="text-muted-foreground">Tenant</p>
            </div>
          </div>

          {review.user.email && (
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 text-muted-foreground" />

              <div className="min-w-0">
                <p className="break-all font-medium">{review.user.email}</p>
                <p className="text-muted-foreground">Email</p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <MessageSquareText className="size-4 text-muted-foreground" />
            Review
          </div>

          <p className="whitespace-pre-wrap break-words text-sm leading-6">
            {review.comment}
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-end border-t pt-4">
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting}
          onClick={() => onDelete(review.review_id, review.property.address)}
        >
          <Trash2 className="mr-2 size-4" />
          {isDeleting ? "Deleting..." : "Delete Review"}
        </Button>
      </CardFooter>
    </Card>
  );
}
