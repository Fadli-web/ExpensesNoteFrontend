"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile, AuthResponse } from "@/lib/types";
import {
  api,
  clearTokens,
  getBaseUrl,
  getStoredAccessToken,
  setCustomBaseUrl,
  storeTokens,
} from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  apiUrl: string;
  backendHealth: "checking" | "online" | "protected" | "offline";
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, full_name?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (full_name?: string, email?: string) => Promise<UserProfile>;
  changePassword: (current_pass: string, new_pass: string) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  updateApiUrl: (url: string) => void;
  toggleDemoMode: (enable?: boolean) => void;
  checkHealth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiUrl, setApiUrlState] = useState("");
  const [backendHealth, setBackendHealth] = useState<"checking" | "online" | "protected" | "offline">("checking");

  const checkHealth = useCallback(async () => {
    setBackendHealth("checking");
    try {
      const res = await api.checkHealth();
      if (res && res.status) {
        setBackendHealth("online");
      } else {
        setBackendHealth("offline");
      }
    } catch (err: any) {
      if (err.message && err.message.includes("Vercel SSO")) {
        setBackendHealth("protected");
      } else {
        setBackendHealth("offline");
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = getStoredAccessToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (err) {
      console.warn("Error fetching profile, attempting /api/auth/me:", err);
      try {
        const meRes = await api.getMe();
        if (meRes?.user) {
          setUser(meRes.user);
        }
      } catch (meErr) {
        console.warn("Could not get me info:", meErr);
        clearTokens();
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    // Purge any existing demo mode flag from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("expenses_demo_mode");
    }

    setApiUrlState(getBaseUrl());

    const token = getStoredAccessToken();
    if (token) {
      refreshProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    checkHealth();
  }, [refreshProfile, checkHealth]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("expenses_demo_mode");
    }

    const res = await api.login({ email, password });
    if (res.session?.access_token) {
      storeTokens(res.session.access_token, res.session.refresh_token);
      await refreshProfile();
    }
    return res;
  };

  const register = async (email: string, password: string, full_name?: string): Promise<AuthResponse> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("expenses_demo_mode");
    }

    const res = await api.register({ email, password, full_name });
    if (res.session?.access_token) {
      storeTokens(res.session.access_token, res.session.refresh_token);
      await refreshProfile();
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    clearTokens();
    if (typeof window !== "undefined") {
      localStorage.removeItem("expenses_demo_mode");
    }
    setUser(null);
  };

  const updateProfile = async (full_name?: string, email?: string): Promise<UserProfile> => {
    const updated = await api.updateProfile({ full_name, email });
    setUser(updated);
    return updated;
  };

  const changePassword = async (current_pass: string, new_pass: string) => {
    await api.changePassword({ current_password: current_pass, new_password: new_pass });
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const res = await api.uploadAvatar(file);
    if (res.avatar_url) {
      setUser((prev) => (prev ? { ...prev, avatar_url: res.avatar_url } : null));
    }
    return res.avatar_url;
  };

  const updateApiUrl = (url: string) => {
    setCustomBaseUrl(url);
    setApiUrlState(url);
    checkHealth();
  };

  const toggleDemoMode = () => {
    // Demo mode is completely removed; purge flag
    if (typeof window !== "undefined") {
      localStorage.removeItem("expenses_demo_mode");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isDemo: false,
        apiUrl,
        backendHealth,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        changePassword,
        uploadAvatar,
        updateApiUrl,
        toggleDemoMode,
        checkHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
