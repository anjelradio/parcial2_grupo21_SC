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
import {
  createHorarioSlice,
  type HorarioSliceType,
} from "./slices/horarioSlice";
import  { createAsignacionSlice ,type AsignacionSliceType } from "./slices/asignacionSlice";
import  { createControlDocenteSlice ,type ControlDocenteSliceType } from "./slices/controlDocenteSlice";

export const useAppStore = create<
  AuthSliceType &
    ProfileSliceType &
    UsersSliceType &
    LoadingSliceType &
    ModalSliceType &
    MateriaSliceType &
    AulaSliceType &
    GrupoSliceType &
    HorarioSliceType & 
    AsignacionSliceType &
    ControlDocenteSliceType
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
        ...createHorarioSlice(...a),
        ...createAsignacionSlice(...a),
        ...createControlDocenteSlice(...a)
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
