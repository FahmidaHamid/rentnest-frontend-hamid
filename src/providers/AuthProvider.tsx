"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isAxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "@/lib/auth-storage";
import { getProfile, login as loginRequest } from "@/services/auth.service";

import type {
  AuthUser,
  LoginInput,
  ProfileResponse,
  UserRole,
} from "@/types/auth";

const AUTH_PROFILE_QUERY_KEY = ["auth", "profile"] as const;

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<AuthUser>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  /*
   * Token access is delayed until the component mounts.
   * This avoids reading localStorage during server rendering.
   */
  const [authStorageReady, setAuthStorageReady] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);

  useEffect(() => {
    setHasAccessToken(Boolean(getAccessToken()));
    setAuthStorageReady(true);
  }, []);

  const profileQuery = useQuery({
    queryKey: AUTH_PROFILE_QUERY_KEY,
    queryFn: getProfile,
    enabled: authStorageReady && hasAccessToken,
    retry: false,
  });

  useEffect(() => {
    if (!profileQuery.error) {
      return;
    }

    const isUnauthorized =
      isAxiosError(profileQuery.error) &&
      (profileQuery.error.response?.status === 401 ||
        profileQuery.error.response?.status === 403);

    if (isUnauthorized) {
      removeAccessToken();
      setHasAccessToken(false);

      queryClient.removeQueries({
        queryKey: AUTH_PROFILE_QUERY_KEY,
      });
    }
  }, [profileQuery.error, queryClient]);

  const login = async (credentials: LoginInput): Promise<AuthUser> => {
    const response = await loginRequest(credentials);

    saveAccessToken(response.accessToken);
    setHasAccessToken(true);

    /*
     * Immediately populate authentication state from the login response.
     * A later profile request can provide the user's full profile.
     */
    queryClient.setQueryData<ProfileResponse>(AUTH_PROFILE_QUERY_KEY, {
      message: response.message,
      user: response.user,
    });

    return response.user;
  };

  const logout = (): void => {
    removeAccessToken();
    setHasAccessToken(false);

    queryClient.removeQueries({
      queryKey: AUTH_PROFILE_QUERY_KEY,
    });
  };

  const user = profileQuery.data?.user ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && hasAccessToken),
      isLoading:
        !authStorageReady || (hasAccessToken && profileQuery.isPending),
      login,
      logout,
      hasRole: (role) => user?.roles.includes(role) ?? false,
    }),
    [authStorageReady, hasAccessToken, profileQuery.isPending, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
