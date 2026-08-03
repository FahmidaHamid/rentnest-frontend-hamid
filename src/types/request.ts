import type { LandlordProperty } from "@/types/property";

export type RequestType = "RENT" | "BUY";

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CreatePropertyRequestInput = {
  property_id: number;
  request_type: RequestType;
};

export type PropertyRequest = {
  request_id: number;
  user_id: number;
  property_id: number;
  request_type: RequestType;
  request_status: RequestStatus;
  created_at: string;
  updated_at: string;
  property: LandlordProperty;
};

export type CreatePropertyRequestResponse = {
  message: string;
  data: Omit<PropertyRequest, "property">;
};

export type PropertyRequestsResponse = {
  message: string;
  data: PropertyRequest[];
};

export type DeletePropertyRequestResponse = {
  message: string;
};
