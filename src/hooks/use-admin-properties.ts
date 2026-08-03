// src/hooks/use-admin-properties.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminProperties,
  updateAdminPropertyStatus,
} from "@/services/admin.service";

import type { AdminPropertyStatus } from "@/types/admin";

export const useAdminProperties = (status?: AdminPropertyStatus) => {
  return useQuery({
    queryKey: ["admin", "properties", status],
    queryFn: () => getAdminProperties(status),
  });
};

export const useUpdateAdminPropertyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminPropertyStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "properties"],
      });
    },
  });
};
