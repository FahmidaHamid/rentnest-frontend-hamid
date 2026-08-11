import api from "@/lib/axios";

import type {
  CreateReviewInput,
  CreateReviewResponse,
  DeleteReviewResponse,
  ReviewsResponse,
} from "@/types/review";

export const getReviews = async (
  propertyId?: number,
): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>("/reviews", {
    params: propertyId ? { propertyId } : undefined,
  });

  return response.data;
};

export const createReview = async (
  payload: CreateReviewInput,
): Promise<CreateReviewResponse> => {
  const response = await api.post<CreateReviewResponse>(
    "/tenants/reviews",
    payload,
  );

  return response.data;
};

export const getAdminReviews = async (): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>("/admin/reviews");

  return response.data;
};

export const deleteAdminReview = async (
  reviewId: number,
): Promise<DeleteReviewResponse> => {
  const response = await api.delete<DeleteReviewResponse>(
    `/admin/reviews/${reviewId}`,
  );

  return response.data;
};
