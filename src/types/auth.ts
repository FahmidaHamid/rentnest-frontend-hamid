export type UserRole = "ADMIN" | "TENANT" | "LANDLORD";

export type TenantProfile = {
  occupation: string | null;
  monthly_income: number | null;
  emergency_contact: string | null;
};

export type LandlordProfile = {
  company_name: string | null;
  business_license: string | null;
  tax_id: string | null;
};

export type AuthUser = {
  user_id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  roles: UserRole[];
  tenantProfile?: TenantProfile | null;
  landlordProfile?: LandlordProfile | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
  accessToken: string;
};

export type ProfileResponse = {
  message: string;
  user: AuthUser;
};

export type TenantRegistrationData = {
  occupation?: string;
  monthly_income?: number;
  emergency_contact?: string;
};

export type LandlordRegistrationData = {
  company_name?: string;
  business_license?: string;
  tax_id?: string;
};

export type RegisterInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles: UserRole[];
  tenant?: TenantRegistrationData;
  landlord?: LandlordRegistrationData;
};

export type RegisterResponse = {
  message: string;
  user: {
    user_id: number;
    email: string;
  };
};
