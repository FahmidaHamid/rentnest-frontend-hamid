// types/admin.ts

import type {
  PropertyCategory,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

export type AdminRequestType = "RENT" | "BUY";

export type AdminRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminPropertyStatus =
  | "PENDING_APPROVAL"
  | "AVAILABLE_FOR_RENT"
  | "IN_MARKET_FOR_SALE"
  | "INAVAILABLE_OR_UNKNOWN"
  | "CURRENTLY_OCCUPIED"
  | "RENTED"
  | "SOLD";

export type AdminPropertyOwner = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  landlordProfile: {
    company_name: string | null;
    business_license: string | null;
    tax_id: string | null;
  } | null;
};

export type AdminPropertyImage = {
  image_id: number;
  image_url: string;
};

export type AdminProperty = {
  property_id: number;
  owner_id: number;
  address: string;
  asking_price: number;
  status: AdminPropertyStatus;
  category: PropertyCategory;
  type: PropertyType;
  created_at: string;
  updated_at: string;
  owner: AdminPropertyOwner;
  property_images: AdminPropertyImage[];
};

export type AdminPropertiesResponse = {
  message: string;
  data: AdminProperty[];
};

export type UpdateAdminPropertyStatusPayload = {
  propertyId: number;
  status:
    | "AVAILABLE_FOR_RENT"
    | "IN_MARKET_FOR_SALE"
    | "INAVAILABLE_OR_UNKNOWN";
};

export type AdminRequestUser = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export type AdminRequestLandlordProfile = {
  company_name: string | null;
  business_license: string | null;
  tax_id: string | null;
};

export type AdminRequestOwner = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  landlordProfile: AdminRequestLandlordProfile | null;
};

export type AdminRequestPropertyImage = {
  image_id: number;
  image_url: string;
};

export type AdminRequestProperty = {
  property_id: number;
  address: string;
  asking_price: number;
  status: PropertyStatus;
  category: PropertyCategory;
  type: PropertyType;
  property_images: AdminRequestPropertyImage[];
  owner: AdminRequestOwner;
};

export type AdminPropertyRequest = {
  request_id: number;
  user_id: number;
  property_id: number;
  request_type: AdminRequestType;
  request_status: AdminRequestStatus;
  created_at: string;
  updated_at: string;
  user: AdminRequestUser;
  property: AdminRequestProperty;
};

export type AdminPropertyRequestsResponse = {
  message: string;
  data: AdminPropertyRequest[];
};

export type AdminRequestFilters = {
  status?: AdminRequestStatus;
  requestType?: AdminRequestType;
};
