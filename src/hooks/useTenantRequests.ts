"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPropertyRequest,
  deletePropertyRequest,
  getMyPropertyRequests,
} from "@/services/tenant.service";

import type { CreatePropertyRequestInput } from "@/types/request";

export const tenantRequestKeys = {
  all: ["tenant", "requests"] as const,
  list: () => [...tenantRequestKeys.all, "list"] as const,
};

export function useTenantRequests() {
  return useQuery({
    queryKey: tenantRequestKeys.list(),
    queryFn: getMyPropertyRequests,
  });
}

export function useCreatePropertyRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyRequestInput) =>
      createPropertyRequest(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: tenantRequestKeys.list(),
      });
    },
  });
}

export function useDeletePropertyRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => deletePropertyRequest(requestId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: tenantRequestKeys.list(),
      });
    },
  });
}
