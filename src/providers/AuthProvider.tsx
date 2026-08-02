"use client";

import {
  createContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { isAxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
  subscribeToAccessToken,
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

function getServerAccessToken(): null {
  return null;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const accessToken = useSyncExternalStore(
    subscribeToAccessToken,
    getAccessToken,
    getServerAccessToken,
  );

  const profileQuery = useQuery({
    queryKey: AUTH_PROFILE_QUERY_KEY,
    queryFn: async () => {
      try {
        return await getProfile();
      } catch (error) {
        const isUnauthorized =
          isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403);

        if (isUnauthorized) {
          removeAccessToken();
        }

        throw error;
      }
    },
    enabled: Boolean(accessToken),
    retry: false,
  });

  const login = useCallback(
    async (credentials: LoginInput): Promise<AuthUser> => {
      const response = await loginRequest(credentials);

      saveAccessToken(response.accessToken);

      queryClient.setQueryData<ProfileResponse>(AUTH_PROFILE_QUERY_KEY, {
        message: response.message,
        user: response.user,
      });

      return response.user;
    },
    [queryClient],
  );

  const logout = useCallback((): void => {
    removeAccessToken();

    queryClient.removeQueries({
      queryKey: AUTH_PROFILE_QUERY_KEY,
    });
  }, [queryClient]);

  const user = profileQuery.data?.user ?? null;

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.roles.includes(role) ?? false;
    },
    [user],
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(accessToken && user),
    isLoading: Boolean(
      accessToken && (profileQuery.isPending || profileQuery.isFetching),
    ),
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
