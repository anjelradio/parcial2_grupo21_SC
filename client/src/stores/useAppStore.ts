import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createAuthSlice, type AuthSliceType } from "./slices/authSlice";
import {
  createProfileSlice,
  type ProfileSliceType,
} from "./slices/profileSlice";
import { createUsersSlice, type UsersSliceType } from "./slices/usersSlice";
import {
  createLoadingSlice,
  type LoadingSliceType,
} from "./slices/loadingSlice";
import { createModalSlice, type ModalSliceType } from "./slices/modalSlice";

export const useAppStore = create<
  AuthSliceType &
    ProfileSliceType &
    UsersSliceType &
    LoadingSliceType &
    ModalSliceType
>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createProfileSlice(...a),
        ...createUsersSlice(...a),
        ...createLoadingSlice(...a),
        ...createModalSlice(...a),
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
