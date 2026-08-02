import api from "@/lib/axios";
import type { PropertiesResponse, Property } from "@/types/property";

export const getProperties = async (): Promise<Property[]> => {
  const response = await api.get<PropertiesResponse | Property[]>(
    "/properties",
  );

  // Handles either:
  // 1. { message: "...", data: [...] }
  // 2. [...]
  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.data;
};

export const getPropertyById = async (id: string): Promise<Property> => {
  const response = await api.get<
    Property | { message?: string; data: Property }
  >(`/properties/${id}`);

  if ("data" in response.data) {
    return response.data.data;
  }

  return response.data;
};
