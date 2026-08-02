export type PropertyFeatures = {
  property_id: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  year_built: number | null;
  parking_spaces: number;
  pet_allowed: boolean;
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
  property_images: string[];
};

export type PropertiesResponse = {
  message?: string;
  data: Property[];
};
