import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createReview,
  deleteAdminReview,
  getAdminReviews,
  getReviews,
} from "@/services/review.service";

import type { CreateReviewInput } from "@/types/review";

export const usePropertyReviews = (propertyId: number) => {
  return useQuery({
    queryKey: ["reviews", "property", propertyId],
    queryFn: () => getReviews(propertyId),
    enabled: Number.isInteger(propertyId) && propertyId > 0,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewInput) => createReview(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "property", variables.property_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "reviews"],
      });
    },
  });
};

export const useAdminReviews = () => {
  return useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: getAdminReviews,
  });
};

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteAdminReview(reviewId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};
