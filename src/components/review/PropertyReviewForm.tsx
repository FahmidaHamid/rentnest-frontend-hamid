"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateReview } from "@/hooks/useReview";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ApiErrorResponse = {
  message?: string;
};

const reviewSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(3, "Your review must contain at least 3 characters.")
    .max(1000, "Your review cannot exceed 1,000 characters."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type PropertyReviewFormProps = {
  propertyId: number;
};

export default function PropertyReviewForm({
  propertyId,
}: PropertyReviewFormProps) {
  const createReviewMutation = useCreateReview();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  //
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      comment: "",
    },
  });

  // const comment = watch("comment");
  // const characterCount = comment.length;

  const comment =
    useWatch({
      control,
      name: "comment",
    }) ?? "";

  const characterCount = comment.length;

  async function onSubmit(values: ReviewFormValues): Promise<void> {
    setSuccessMessage(null);
    setApiErrorMessage(null);

    try {
      const response = await createReviewMutation.mutateAsync({
        property_id: propertyId,
        comment: values.comment.trim(),
      });

      setSuccessMessage(response.message);
      reset();
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        setApiErrorMessage(
          error.response?.data?.message ??
            "Unable to submit your review. Please try again.",
        );
        return;
      }

      setApiErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>

        <CardDescription>
          Share your thoughts or questions about this property.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-sm font-medium">
              Your review
            </label>

            <textarea
              id="review-comment"
              rows={5}
              maxLength={1000}
              placeholder="Write your review or question about this property..."
              disabled={createReviewMutation.isPending}
              className="flex min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("comment")}
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                {errors.comment && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              <p className="shrink-0 text-xs text-muted-foreground">
                {characterCount}/1000
              </p>
            </div>
          </div>

          {apiErrorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {apiErrorMessage}
            </p>
          )}

          {successMessage && (
            <p role="status" className="text-sm text-emerald-700">
              {successMessage}
            </p>
          )}

          <Button type="submit" disabled={createReviewMutation.isPending}>
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
