import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    data,
    isLoading,
    refetch: refetchMe
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<AuthUser>("/auth/me"),
    retry: false
  });

  const login = React.useCallback(async (payload: { email: string; password: string }) => {
    await api.post("/auth/login", payload);
    await refetchMe();
  }, [refetchMe]);

  const register = React.useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      await api.post("/auth/register", payload);
      await refetchMe();
    },
    [refetchMe]
  );

  const logout = React.useCallback(async () => {
    await api.post("/auth/logout");
    await refetchMe();
  }, [refetchMe]);

  const refresh = React.useCallback(async () => {
    await refetchMe();
  }, [refetchMe]);

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        loading: isLoading,
        login,
        register,
        logout,
        refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
