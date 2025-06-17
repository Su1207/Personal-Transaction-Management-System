import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

const baseUrl =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:8081/api";

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    username: string,
    password: string,
    fullName: string,
    phoneNumber: string
  ) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      logout: async () => {
        await fetch(`${baseUrl}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        set({ user: null });
      },

      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),

      login: async (username, password) => {
        try {
          const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password }),
            credentials: "include",
          });

          const data = await res.json();

          if (!res.ok) {
            return {
              success: false,
              error: data.message || "Invalid credentials",
            };
          }

          set({ user: data.user });
          return { success: true };
        } catch {
          return { success: false, error: "Login failed" };
        }
      },

      signup: async (username, password, fullName, phoneNumber) => {
        try {
          const res = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, fullName, phoneNumber }),
            credentials: "include",
          });

          const message = await res.text();
          if (!res.ok) {
            return {
              success: false,
              error: message || "Signup failed",
            };
          }

          return { success: true, message };
        } catch {
          return { success: false, error: "Signup failed" };
        }
      },

      checkAuth: async () => {
        try {
          const res = await fetch(`${baseUrl}/auth/me`, {
            method: "GET",
            credentials: "include",
          });

          const data = await res.json();

          if (res.ok && data.user) {
            set({ user: data.user });
          } else {
            set({ user: null });
          }
        } catch {
          set({ user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => async (state) => {
        await state?.checkAuth();
        state?.setHasHydrated();
      },
    }
  )
);
