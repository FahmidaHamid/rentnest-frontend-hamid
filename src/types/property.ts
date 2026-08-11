export type PropertyStatus =
  | "PENDING_APPROVAL"
  | "AVAILABLE_FOR_RENT"
  | "IN_MARKET_FOR_SALE"
  | "CURRENTLY_OCCUPIED"
  | "INAVAILABLE_OR_UNKNOWN"
  | "RENTED"
  | "SOLD";

export type PropertyCategory = "RESIDENTIAL" | "COMMERCIAL";

export type PropertyType =
  | "SINGLE_FAMILY_HOME"
  | "TOWNHOUSE"
  | "APARTMENT_COMPLEX"
  | "OFFICE_SPACE"
  | "STORAGE_SPACE";

export type PropertyFeature = {
  property_id: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  year_built: number | null;
  parking_spaces: number;
  pet_allowed: boolean;
};

export type LandlordProperty = {
  property_id: number;
  owner_id: number;
  address: string;
  asking_price: number;
  status: PropertyStatus;
  category: PropertyCategory;
  type: PropertyType;
  created_at: string;
  updated_at: string;
  features: PropertyFeature | null;
  property_images: PropertyImage[];
};

export type CreatePropertyInput = {
  address: string;
  asking_price: number;
  category: PropertyCategory;
  type: PropertyType;

  features: {
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    year_built?: number;
    parking_spaces: number;
    pet_allowed: boolean;
  };
  property_images: string[];
};

export type LandlordPropertiesResponse = {
  message: string;
  data: LandlordProperty[];
};

export type LandlordPropertyResponse = {
  message: string;
  data: LandlordProperty;
};

export type PropertyFeatures = {
  property_id: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  year_built: number | null;
  parking_spaces: number;
  pet_allowed: boolean;
};

export type PropertyImage = {
  image_id: number;
  property_id: number;
  image_url: string;
};

export type Property = {
  property_id: number;
  owner_id: number;
  address: string;
  asking_price: number;
  status: string;
  category: string;
  type: string;
  created_at: string;
  updated_at: string;
  features: PropertyFeatures | null;
  property_images: PropertyImage[];
};

export type PropertiesResponse = {
  message?: string;
  data: Property[];
};

export type UpdatePropertyInput = {
  address?: string;
  asking_price?: number;
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    square_feet?: number;
    year_built?: number | null;
    parking_spaces?: number;
    pet_allowed?: boolean;
  };
};

export type UpdatePropertyVariables = {
  propertyId: number;
  payload: UpdatePropertyInput;
};

export type DeletePropertyResponse = {
  message: string;
};
