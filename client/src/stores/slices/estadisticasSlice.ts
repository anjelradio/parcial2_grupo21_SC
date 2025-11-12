import type { StateCreator } from "zustand";
import type { ControlDocenteStats } from "../../types";
import { getControlDocenteStats } from "../../api/estadisticasService";

export type EstadisticasSliceType = {
  // ============================================
  // ESTADÍSTICAS: CONTROL DOCENTE
  // ============================================
  statsControlDocente: ControlDocenteStats | null;

  // Estados de carga y control
  isLoadingStatsControlDocente: boolean;
  hasLoadedStatsControlDocente: boolean;
  statsControlDocenteResponse: { ok: boolean; message: string };

  // Acciones de Control Docente
  fetchStatsControlDocente: (force?: boolean) => Promise<void>;
  clearStatsControlDocente: () => void;
};

// Estado base para respuestas
const initialResponse = { ok: false, message: "" };

export const createEstadisticasSlice: StateCreator<EstadisticasSliceType> = (
  set,
  get
) => ({
  // ============================================
  // ESTADÍSTICAS: CONTROL DOCENTE
  // ============================================

  // --- Estado principal ---
  statsControlDocente: null,

  // --- Estados de carga y control ---
  isLoadingStatsControlDocente: false,
  hasLoadedStatsControlDocente: false,
  statsControlDocenteResponse: initialResponse,

  // --- Acción principal: obtener estadísticas ---
  fetchStatsControlDocente: async (force = false) => {
    const { hasLoadedStatsControlDocente } = get();
    if (hasLoadedStatsControlDocente && !force) return;

    set({ isLoadingStatsControlDocente: true });

    try {
      const response = await getControlDocenteStats();

      if (response.ok && response.data) {
        set({
          statsControlDocente: response.data,
          statsControlDocenteResponse: { ok: true, message: response.message },
          hasLoadedStatsControlDocente: true,
          isLoadingStatsControlDocente: false,
        });
      } else {
        set({
          statsControlDocenteResponse: {
            ok: false,
            message:
              response.message ||
              "Error al obtener estadísticas de control docente",
          },
          isLoadingStatsControlDocente: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchStatsControlDocente:", error);
      set({
        statsControlDocenteResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingStatsControlDocente: false,
      });
    }
  },

  // --- Acción de limpieza ---
  clearStatsControlDocente: () =>
    set({
      statsControlDocente: null,
      hasLoadedStatsControlDocente: false,
      statsControlDocenteResponse: initialResponse,
    }),
});
