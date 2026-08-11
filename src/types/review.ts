export type ReviewUser = {
  user_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
};

export type ReviewProperty = {
  property_id: number;
  address: string;
};

export type Review = {
  review_id: number;
  user_id: number;
  property_id: number;
  comment: string;
  created_at: string;
  updated_at?: string;
  user: ReviewUser;
  property: ReviewProperty;
};

export type ReviewsResponse = {
  message: string;
  data: Review[];
};

export type CreateReviewInput = {
  property_id: number;
  comment: string;
};

export type CreatedReview = {
  review_id: number;
  user_id: number;
  property_id: number;
  comment: string;
  created_at: string;
  updated_at?: string;
};

export type CreateReviewResponse = {
  message: string;
  data: CreatedReview;
};

export type DeleteReviewResponse = {
  message: string;
};
