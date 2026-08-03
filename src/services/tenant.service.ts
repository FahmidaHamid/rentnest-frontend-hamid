import api from "@/lib/axios";

import type {
  CreatePropertyRequestInput,
  CreatePropertyRequestResponse,
  DeletePropertyRequestResponse,
  PropertyRequestsResponse,
} from "@/types/request";

export async function createPropertyRequest(
  payload: CreatePropertyRequestInput,
): Promise<CreatePropertyRequestResponse> {
  const { data } = await api.post<CreatePropertyRequestResponse>(
    "/tenants/requests",
    payload,
  );

  return data;
}

export async function getMyPropertyRequests(): Promise<PropertyRequestsResponse> {
  const { data } = await api.get<PropertyRequestsResponse>("/tenants/requests");

  return data;
}

export async function deletePropertyRequest(
  requestId: number,
): Promise<DeletePropertyRequestResponse> {
  const { data } = await api.delete<DeletePropertyRequestResponse>(
    `/tenants/requests/${requestId}`,
  );

  return data;
}
