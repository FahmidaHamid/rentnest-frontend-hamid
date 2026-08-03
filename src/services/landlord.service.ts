import api from "@/lib/axios";

import type {
  CreatePropertyInput,
  DeletePropertyResponse,
  LandlordPropertiesResponse,
  LandlordPropertyResponse,
  UpdatePropertyInput,
} from "@/types/property";

export async function getMyProperties(): Promise<LandlordPropertiesResponse> {
  const { data } = await api.get<LandlordPropertiesResponse>(
    "/landlord/properties",
  );

  return data;
}

export async function getMyPropertyById(
  propertyId: number,
): Promise<LandlordPropertyResponse> {
  const { data } = await api.get<LandlordPropertyResponse>(
    `/landlord/properties/${propertyId}`,
  );

  return data;
}

export async function createProperty(
  payload: CreatePropertyInput,
): Promise<LandlordPropertyResponse> {
  const { data } = await api.post<LandlordPropertyResponse>(
    "/landlord/properties",
    payload,
  );

  return data;
}

export async function updateProperty(
  propertyId: number,
  payload: UpdatePropertyInput,
): Promise<LandlordPropertyResponse> {
  const { data } = await api.patch<LandlordPropertyResponse>(
    `/landlord/properties/${propertyId}`,
    payload,
  );

  return data;
}

export async function deleteProperty(
  propertyId: number,
): Promise<DeletePropertyResponse> {
  const { data } = await api.delete<DeletePropertyResponse>(
    `/landlord/properties/${propertyId}`,
  );

  return data;
}
