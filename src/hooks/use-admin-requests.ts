import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminRequests,
  updateAdminRequestStatus,
} from "@/services/admin.service";

import type { AdminRequestFilters } from "@/types/admin";

export const useAdminRequests = (filters?: AdminRequestFilters) => {
  return useQuery({
    queryKey: ["admin", "requests", filters],
    queryFn: () => getAdminRequests(filters),
  });
};

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminRequestStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "requests"],
      });
    },
  });
};
