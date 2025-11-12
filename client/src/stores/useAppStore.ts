import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  createAuthSlice,
  type AuthSliceType,
} from "./slices/auth&Seguridad/authSlice";
import {
  createProfileSlice,
  type ProfileSliceType,
} from "./slices/auth&Seguridad/profileSlice";
import {
  createUsersSlice,
  type UsersSliceType,
} from "./slices/usuarios&Sistema/usersSlice";
import {
  createLoadingSlice,
  type LoadingSliceType,
} from "./slices/loadingSlice";
import { createModalSlice, type ModalSliceType } from "./slices/modalSlice";
import {
  createMateriaSlice,
  type MateriaSliceType,
} from "./slices/gestionAcademica/materiaSlice";
import {
  createAulaSlice,
  type AulaSliceType,
} from "./slices/gestionAcademica/aulaSlice";
import {
  createGrupoSlice,
  type GrupoSliceType,
} from "./slices/gestionAcademica/grupoSlice";
import {
  createHorarioSlice,
  type HorarioSliceType,
} from "./slices/gestionAcademica/horarioSlice";
import {
  createAsignacionSlice,
  type AsignacionSliceType,
} from "./slices/asignacionesAcademicas/asignacionSlice";
import {
  createControlDocenteSlice,
  type ControlDocenteSliceType,
} from "./slices/controlDocente/controlDocenteSlice";
import { createUtilsSlice, type UtilsSliceType } from "./slices/utilsSlice";
import {
  createEstadisticasSlice,
  type EstadisticasSliceType,
} from "./slices/estadisticasSlice";
import {
  createSuplenciasSlice,
  type SuplenciasSliceType,
} from "./slices/controlDocente/suplenciasSlice";
import {
  createAsistenciaSlice,
  type AsistenciaSliceType,
} from "./slices/AsistenciaDocente/asistenciaSlice";

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
    ControlDocenteSliceType &
    UtilsSliceType &
    EstadisticasSliceType &
    SuplenciasSliceType &
    AsistenciaSliceType
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
        ...createControlDocenteSlice(...a),
        ...createUtilsSlice(...a),
        ...createEstadisticasSlice(...a),
        ...createSuplenciasSlice(...a),
        ...createAsistenciaSlice(...a)
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
