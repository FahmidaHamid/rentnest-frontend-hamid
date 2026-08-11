import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  preparePayment,
  getPaymentByRequest,
} from "@/services/payment.service";

import type { CreatePaymentInput } from "@/types/payment";

export const usePaymentByRequest = (requestId: number) => {
  return useQuery({
    queryKey: ["payments", "request", requestId],
    queryFn: () => getPaymentByRequest(requestId),
    enabled: Number.isInteger(requestId) && requestId > 0,
  });
};

export const usePreparePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePaymentInput) => preparePayment(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant", "requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payments", "request", variables.request_id],
      });
    },
  });
};
