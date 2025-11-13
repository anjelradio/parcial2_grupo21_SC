import type { StateCreator } from "zustand";
import type { EstadisticasAsignacionResponse, EstadisticasGlobalesResponse } from "../../../types";
import { getEstadisticasGlobales, getEstadisticasPorAsignacion } from "../../../api/supervisionService";


export interface SupervisionSliceType {

  supervisionGlobalData: EstadisticasGlobalesResponse["data"] | null;
  supervisionGlobalLoading: boolean;
  supervisionGlobalLoaded: boolean;


  supervisionAsignacionData: EstadisticasAsignacionResponse["data"] | null;
  supervisionAsignacionLoading: boolean;

  fetchSupervisionGlobal: (id_gestion?: number) => Promise<void>;
  fetchSupervisionAsignacion: (id_asignacion: number) => Promise<void>;


  resetSupervision: () => void;
  selectedAsignacionId: number | null;
  selectAsignacionSup: (id: number) => void;
}

export const createSupervisionSlice: StateCreator<
  SupervisionSliceType,
  [],
  [],
  SupervisionSliceType
> = (set, get) => ({

  supervisionGlobalData: null,
  supervisionGlobalLoading: false,
  supervisionGlobalLoaded: false,
  selectedAsignacionId: null,


  supervisionAsignacionData: null,
  supervisionAsignacionLoading: false,


  fetchSupervisionGlobal: async (id_gestion?: number) => {
    const { supervisionGlobalLoaded } = get();

    if (supervisionGlobalLoaded && !id_gestion) {
      console.log("✔️ Supervisión global ya cargada (cache)");
      return;
    }

    set({ supervisionGlobalLoading: true });

    try {
      const response = await getEstadisticasGlobales(id_gestion);

      if (response.ok) {
        set({
          supervisionGlobalData: response.data,
          supervisionGlobalLoaded: true,
          supervisionGlobalLoading: false,
        });
      } else {
        console.error("Error en estadísticas globales:", response.message);
        set({ supervisionGlobalLoading: false });
      }
    } catch (e) {
      console.error("ERROR fetchSupervisionGlobal:", e);
      set({ supervisionGlobalLoading: false });
    }
  },

  // ============================================
  // MÉTODO: ESTADÍSTICAS POR ASIGNACIÓN
  // ============================================
  fetchSupervisionAsignacion: async (id_asignacion: number) => {
    set({ supervisionAsignacionLoading: true });

    try {
      const response = await getEstadisticasPorAsignacion(id_asignacion);

      if (response.ok) {
        set({
          supervisionAsignacionData: response.data,
          supervisionAsignacionLoading: false,
        });
      } else {
        console.error(
          "Error en estadísticas por asignación:",
          response.message
        );
        set({ supervisionAsignacionLoading: false });
      }
    } catch (e) {
      console.error("ERROR fetchSupervisionAsignacion:", e);
      set({ supervisionAsignacionLoading: false });
    }
  },

  resetSupervision: () =>
    set({
      supervisionGlobalData: null,
      supervisionAsignacionData: null,

      supervisionGlobalLoading: false,
      supervisionAsignacionLoading: false,

      supervisionGlobalLoaded: false,
    }),
    selectAsignacionSup: (id: number) => {
    console.log("Gestión seleccionada:", id);
    set({ selectedAsignacionId: id });

    get().fetchSupervisionAsignacion(id);
  },

});
