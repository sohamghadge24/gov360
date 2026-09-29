"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, AuthUser } from "@/lib/api/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const data = await authApi.me();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Protect routes
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      router.push("/login");
    }
  };

  const refreshAuth = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
