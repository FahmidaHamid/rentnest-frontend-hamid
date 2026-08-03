"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProperty,
  deleteProperty,
  getMyProperties,
  getMyPropertyById,
  updateProperty,
} from "@/services/landlord.service";

import type {
  CreatePropertyInput,
  UpdatePropertyVariables,
} from "@/types/property";

export const landlordPropertyKeys = {
  all: ["landlord", "properties"] as const,

  list: () => [...landlordPropertyKeys.all, "list"] as const,

  detail: (propertyId: number) =>
    [...landlordPropertyKeys.all, "detail", propertyId] as const,
};

export function useLandlordProperties() {
  return useQuery({
    queryKey: landlordPropertyKeys.list(),
    queryFn: getMyProperties,
  });
}

export function useLandlordProperty(propertyId: number) {
  return useQuery({
    queryKey: landlordPropertyKeys.detail(propertyId),
    queryFn: () => getMyPropertyById(propertyId),
    enabled: Number.isInteger(propertyId) && propertyId > 0,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropertyInput) => createProperty(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: landlordPropertyKeys.list(),
      });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, payload }: UpdatePropertyVariables) =>
      updateProperty(propertyId, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: landlordPropertyKeys.list(),
        }),

        queryClient.invalidateQueries({
          queryKey: landlordPropertyKeys.detail(variables.propertyId),
        }),
      ]);
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: number) => deleteProperty(propertyId),

    onSuccess: async (_, propertyId) => {
      queryClient.removeQueries({
        queryKey: landlordPropertyKeys.detail(propertyId),
      });

      await queryClient.invalidateQueries({
        queryKey: landlordPropertyKeys.list(),
      });
    },
  });
}
