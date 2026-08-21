import api from "@/lib/axios";

import type {
  GoogleLoginResponse,
  GoogleRegisterInput,
  GoogleRegisterResponse,
  LoginInput,
  LoginResponse,
  ProfileResponse,
  RegisterInput,
  RegisterResponse,
} from "@/types/auth";

export async function login(credentials: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);

  return data;
}

export async function googleLogin(
  credential: string,
): Promise<GoogleLoginResponse> {
  const { data } = await api.post<GoogleLoginResponse>("/auth/google/login", {
    credential,
  });

  return data;
}

export async function register(
  payload: RegisterInput,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);

  return data;
}

export async function registerGoogleUser(
  payload: GoogleRegisterInput,
): Promise<GoogleRegisterResponse> {
  const { data } = await api.post<GoogleRegisterResponse>(
    "/auth/google/register",
    payload,
  );

  return data;
}

export async function getProfile(): Promise<ProfileResponse> {
  const { data } = await api.get<ProfileResponse>("/auth/profile");

  return data;
}
