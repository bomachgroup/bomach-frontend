"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { loginUser, refreshToken as refreshTokenApi, logoutUser } from "@/lib/api";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");
    const storedEmail = localStorage.getItem("user_email");

    if (storedToken && storedEmail) {
      setAccessToken(storedToken);
      setUser({ email: storedEmail });
    }

    // Try to refresh if we have a refresh token
    if (storedRefresh && !storedToken) {
      refreshTokenApi(storedRefresh)
        .then((res) => {
          localStorage.setItem("access_token", res.access_token);
          setAccessToken(res.access_token);
          if (storedEmail) setUser({ email: storedEmail });
        })
        .catch(() => {
          // Refresh failed, clear everything
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_email");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginUser(email, password);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    localStorage.setItem("user_email", email);
    setAccessToken(res.access_token);
    setUser({ email });
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (token && refresh) {
      try {
        await logoutUser(token, refresh);
      } catch {
        // Logout API failed, still clear local state
      }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
