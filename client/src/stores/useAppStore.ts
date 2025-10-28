import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createAuthSlice, type AuthSliceType } from "./slices/authSlice";

export const useAppStore = create<AuthSliceType>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          user: state.user,
          tokens: state.tokens,
        }),
      }
    )
  )
);