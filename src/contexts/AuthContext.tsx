"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
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
  /** Wraps an async call: on 401 tries a silent refresh then retries once. */
  withAuth: <T>(fn: (token: string) => Promise<T>) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Refresh the token 60 seconds before it expires
const REFRESH_BUFFER_S = 60;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guard against concurrent refresh attempts
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  // ── Helpers ──

  const clearSession = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("token_expires_at");
    setAccessToken(null);
    setUser(null);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const saveSession = useCallback((access: string, refresh: string, email: string, expiresIn: number) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user_email", email);
    localStorage.setItem("token_expires_at", String(expiresAt));
    setAccessToken(access);
    setUser({ email });
  }, []);

  // ── Silent refresh ──

  const silentRefresh = useCallback(async (): Promise<string | null> => {
    // Deduplicate concurrent refresh calls
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    const promise = (async () => {
      const storedRefresh = localStorage.getItem("refresh_token");
      const storedEmail = localStorage.getItem("user_email");
      if (!storedRefresh || !storedEmail) {
        clearSession();
        return null;
      }

      try {
        const res = await refreshTokenApi(storedRefresh);
        saveSession(res.access_token, storedRefresh, storedEmail, res.expires_in);
        scheduleRefresh(res.expires_in);
        return res.access_token;
      } catch {
        clearSession();
        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = promise;
    return promise;
  }, [clearSession, saveSession]);

  // ── Proactive refresh timer ──

  const scheduleRefresh = useCallback((expiresIn: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const delayMs = Math.max((expiresIn - REFRESH_BUFFER_S) * 1000, 0);
    refreshTimerRef.current = setTimeout(() => {
      silentRefresh();
    }, delayMs);
  }, [silentRefresh]);

  // ── Restore session on mount ──

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");
    const storedEmail = localStorage.getItem("user_email");
    const storedExpiresAt = localStorage.getItem("token_expires_at");

    if (!storedRefresh || !storedEmail) {
      clearSession();
      setIsLoading(false);
      return;
    }

    const expiresAt = storedExpiresAt ? Number(storedExpiresAt) : 0;
    const remainingMs = expiresAt - Date.now();

    if (storedToken && remainingMs > REFRESH_BUFFER_S * 1000) {
      // Token still valid — restore and schedule refresh
      setAccessToken(storedToken);
      setUser({ email: storedEmail });
      scheduleRefresh(Math.floor(remainingMs / 1000));
      setIsLoading(false);
    } else {
      // Token expired or about to — try refreshing now
      silentRefresh().finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  // ── Login ──

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginUser(email, password);
    saveSession(res.access_token, res.refresh_token, email, res.expires_in);
    scheduleRefresh(res.expires_in);
  }, [saveSession, scheduleRefresh]);

  // ── Logout ──

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
    clearSession();
  }, [clearSession]);

  // ── withAuth: 401 interceptor with auto-retry ──

  const withAuth = useCallback(async <T,>(fn: (token: string) => Promise<T>): Promise<T> => {
    const token = accessToken || localStorage.getItem("access_token");
    if (!token) {
      clearSession();
      throw new Error("Not authenticated");
    }

    try {
      return await fn(token);
    } catch (err: unknown) {
      // Check if it's a 401-like error
      const message = err instanceof Error ? err.message : "";
      const is401 = message.toLowerCase().includes("unauthorized") ||
                     message.toLowerCase().includes("token") ||
                     message.includes("401");

      if (!is401) throw err;

      // Try silent refresh
      const newToken = await silentRefresh();
      if (!newToken) {
        throw new Error("Session expired. Please log in again.");
      }

      // Retry with new token
      return await fn(newToken);
    }
  }, [accessToken, clearSession, silentRefresh]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        logout,
        withAuth,
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
