//import api from "@/services/api";
import api from "@/lib/axios";

import type {
  AdminPropertiesResponse,
  AdminPropertyRequestsResponse,
  AdminPropertyStatus,
  AdminRequestFilters,
  AdminRequestStatus,
  UpdateAdminPropertyStatusPayload,
} from "@/types/admin";

export const getAdminProperties = async (
  status?: AdminPropertyStatus,
): Promise<AdminPropertiesResponse> => {
  const response = await api.get<AdminPropertiesResponse>("/admin/properties", {
    params: status ? { status } : undefined,
  });

  return response.data;
};

export const updateAdminPropertyStatus = async ({
  propertyId,
  status,
  reviewedUpdatedAt,
}: UpdateAdminPropertyStatusPayload) => {
  const response = await api.patch(`/admin/properties/${propertyId}/status`, {
    status,
    reviewed_updated_at: reviewedUpdatedAt,
  });

  return response.data;
};

export const getAdminRequests = async (
  filters?: AdminRequestFilters,
): Promise<AdminPropertyRequestsResponse> => {
  const response = await api.get("/admin/requests", {
    params: filters,
  });

  return response.data;
};

export type UpdateRequestStatusPayload = {
  requestId: number;
  status: AdminRequestStatus;
};

export const updateAdminRequestStatus = async ({
  requestId,
  status,
}: UpdateRequestStatusPayload) => {
  const response = await api.patch(`/admin/requests/${requestId}/status`, {
    request_status: status,
  });

  return response.data;
};

// export const updateAdminRequestStatus = async (
//   requestId: number,
//   status: AdminRequestStatus,
// ) => {
//   const response = await api.patch(`/admin/requests/${requestId}/status`, {
//     request_status: status,
//   });

//   return response.data;
// };
