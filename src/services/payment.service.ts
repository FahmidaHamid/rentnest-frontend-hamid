import api from "@/lib/axios";

import type {
  CreatePaymentInput,
  CreatePaymentResponse,
  PaymentResponse,
} from "@/types/payment";

export const preparePayment = async (
  payload: CreatePaymentInput,
): Promise<CreatePaymentResponse> => {
  const response = await api.post<CreatePaymentResponse>(
    "/payments/create",
    payload,
  );

  return response.data;
};

export const getPaymentByRequest = async (
  requestId: number,
): Promise<PaymentResponse> => {
  const response = await api.get<PaymentResponse>(
    `/payments/request/${requestId}`,
  );

  return response.data;
};
