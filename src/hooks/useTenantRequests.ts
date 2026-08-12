"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  createPropertyRequest,
  deletePropertyRequest,
  getMyPropertyRequests,
} from "@/services/tenant.service";

import type { CreatePropertyRequestInput } from "@/types/request";

export const tenantRequestKeys = {
  all: ["tenant", "requests"] as const,

  list: (userId: number) => [...tenantRequestKeys.all, "list", userId] as const,
};

export function useTenantRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: tenantRequestKeys.list(user?.user_id ?? 0),
    queryFn: getMyPropertyRequests,
    enabled: Boolean(user),
  });
}

export function useCreatePropertyRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyRequestInput) =>
      createPropertyRequest(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: tenantRequestKeys.all,
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
        queryKey: tenantRequestKeys.all,
      });
    },
  });
}
