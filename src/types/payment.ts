export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED";

export type PaymentAttempt = {
  attempt_id: number;
  payment_id: number;
  stripe_payment_intent_id: string;
  stripe_status: string;
  failure_message: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  payment_id: number;
  user_id: number;
  request_id: number;

  /**
   * Amount stored in the smallest currency unit.
   * For USD, this value is in cents.
   *
   * Example:
   * 250000 = $2,500.00
   */
  amount: number;

  currency: string;
  payment_status: PaymentStatus;

  created_at: string;
  updated_at: string;

  attempts: PaymentAttempt[];
};

export type CreatePaymentInput = {
  request_id: number;
};

export type CreatePaymentData = {
  payment: Payment;

  /**
   * Null when checkout should not be initialized,
   * for example when payment is already SUCCESS
   * or currently PROCESSING.
   */
  stripe_payment_intent_id: string | null;
  client_secret: string | null;
};

export type CreatePaymentResponse = {
  message: string;
  data: CreatePaymentData;
};

export type PaymentByRequestData = {
  payment: Payment | null;
};

export type PaymentResponse = {
  message: string;
  data: PaymentByRequestData;
};
