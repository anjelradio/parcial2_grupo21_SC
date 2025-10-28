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
import {
  createMateriaSlice,
  type MateriaSliceType,
} from "./slices/materiaSlice";
import { createAulaSlice, type AulaSliceType } from "./slices/aulaSlice";
import { createGrupoSlice, type GrupoSliceType } from "./slices/grupoSlice";

export const useAppStore = create<
  AuthSliceType &
    ProfileSliceType &
    UsersSliceType &
    LoadingSliceType &
    ModalSliceType &
    MateriaSliceType &
    AulaSliceType &
    GrupoSliceType
>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createProfileSlice(...a),
        ...createUsersSlice(...a),
        ...createLoadingSlice(...a),
        ...createModalSlice(...a),
        ...createMateriaSlice(...a),
        ...createAulaSlice(...a),
        ...createGrupoSlice(...a),
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
