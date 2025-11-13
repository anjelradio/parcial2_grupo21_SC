import type { StateCreator } from "zustand";
import type {
  DocenteLite,
  EstadisticasGestion,
  FiltrosAplicadosDocentes,
  FiltrosAplicadosGrupos,
  GestionAcademica,
  GrupoMateriaLite,
  Paginacion,
} from "../../../types";
import {
  getDocentesGestion,
  getEstadisticasGestion,
  getGruposGestion,
  getSemestres,
} from "../../../api/consultaGestionService";

const initialResponse = { ok: false, message: "" };

export type ConsultaGestionSliceType = {
  // ============================================
  // SEMESTRES
  // ============================================
  gestiones: GestionAcademica[];
  isLoadingGestiones: boolean;
  hasLoadedGestiones: boolean;
  gestionesResponse: { ok: boolean; message: string };

  fetchGestiones: (force?: boolean) => Promise<void>;
  clearGestiones: () => void;

  // ============================================
  // GESTIÓN SELECCIONADA
  // ============================================
  selectedGestionId: number | null;
  selectGestion: (id: number) => void;
  clearSelectedGestion: () => void;

  // ============================================
  // ESTADÍSTICAS DE GESTIÓN
  // ============================================
  estadisticasGestion: EstadisticasGestion | null;
  isLoadingEstadisticasGestion: boolean;
  hasLoadedEstadisticasGestion: boolean;
  estadisticasGestionResponse: { ok: boolean; message: string };

  fetchEstadisticasGestion: (
    id_gestion: number,
    force?: boolean
  ) => Promise<void>;
  clearEstadisticasGestion: () => void;

  // ============================================
  // DOCENTES (PAGINADO)
  // ============================================
  docentesGestion: DocenteLite[];
  docentesGestionPaginacion: Paginacion;
  docentesGestionFiltros: FiltrosAplicadosDocentes;
  isLoadingDocentesGestion: boolean;
  hasLoadedDocentesGestion: boolean;
  docentesGestionResponse: { ok: boolean; message: string };
  fetchDocentesGestion: (params?: {
    page?: number;
    page_size?: number;
    nombre_docente?: string;
  }) => Promise<void>;
  clearDocentesGestion: () => void;

  // ============================================
  // GRUPOS/MATERIAS (PAGINADO)
  // ============================================
  gruposMateriasGestion: GrupoMateriaLite[];
  gruposGestionPaginacion: Paginacion;
  gruposGestionFiltros: FiltrosAplicadosGrupos;
  isLoadingGruposGestion: boolean;
  hasLoadedGruposGestion: boolean;
  gruposGestionResponse: { ok: boolean; message: string };
  fetchGruposMateriasGestion: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }) => Promise<void>;
  clearGruposMateriasGestion: () => void;
};

export const createConsultaGestionSlice: StateCreator<
  ConsultaGestionSliceType
> = (set, get) => ({
  gestiones: [],
  isLoadingGestiones: false,
  hasLoadedGestiones: false,
  gestionesResponse: initialResponse,

  selectedGestionId: null,

  fetchGestiones: async (force = false) => {
    const { hasLoadedGestiones } = get();
    if (hasLoadedGestiones && !force) return;

    set({ isLoadingGestiones: true });

    try {
      const response = await getSemestres();
      console.log("Respuesta semestres:", response);

      if (response.ok && response.data.length > 0) {
        set({
          gestiones: response.data,
          gestionesResponse: { ok: true, message: response.message },
          hasLoadedGestiones: true,
          isLoadingGestiones: false,
        });
      } else {
        set({
          gestionesResponse: {
            ok: false,
            message: response.message || "No se pudieron obtener los semestres",
          },
          isLoadingGestiones: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchSemestres:", error);
      set({
        gestionesResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingGestiones: false,
      });
    }
  },

  clearGestiones: () =>
    set({
      gestiones: [],
      hasLoadedGestiones: false,
      gestionesResponse: initialResponse,
    }),

  selectGestion: (id: number) => {
    console.log("Gestión seleccionada:", id);
    set({ selectedGestionId: id });
  },

  clearSelectedGestion: () => {
    set({ selectedGestionId: null });
  },

  // ============================================
  // ESTADÍSTICAS DE GESTIÓN
  // ============================================
  estadisticasGestion: null,
  isLoadingEstadisticasGestion: false,
  hasLoadedEstadisticasGestion: false,
  estadisticasGestionResponse: initialResponse,

  fetchEstadisticasGestion: async (id_gestion, force = false) => {
    const { hasLoadedEstadisticasGestion } = get();
    if (hasLoadedEstadisticasGestion && !force) return;

    set({ isLoadingEstadisticasGestion: true });

    try {
      const response = await getEstadisticasGestion(id_gestion);
      console.log("Respuesta estadísticas gestión:", response);

      if (response.ok && response.data) {
        set({
          estadisticasGestion: response.data,
          estadisticasGestionResponse: { ok: true, message: response.message },
          hasLoadedEstadisticasGestion: true,
          isLoadingEstadisticasGestion: false,
        });
      } else {
        set({
          estadisticasGestionResponse: {
            ok: false,
            message:
              response.message || "No se pudieron obtener las estadísticas",
          },
          isLoadingEstadisticasGestion: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchEstadisticas:", error);
      set({
        estadisticasGestionResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingEstadisticasGestion: false,
      });
    }
  },

  clearEstadisticasGestion: () =>
    set({
      estadisticasGestion: null,
      hasLoadedEstadisticasGestion: false,
      estadisticasGestionResponse: initialResponse,
    }),
  // ============================================
  // DOCENTES (PAGINADO)
  // ============================================
  docentesGestion: [],
  docentesGestionPaginacion: {
    total_registros: 0,
    total_paginas: 0,
    pagina_actual: 1,
    registros_por_pagina: 20,
    tiene_siguiente: false,
    tiene_anterior: false,
  },
  docentesGestionFiltros: {
    nombre_docente: null,
  },
  isLoadingDocentesGestion: false,
  hasLoadedDocentesGestion: false,
  docentesGestionResponse: initialResponse,

  fetchDocentesGestion: async (params = { page: 1, page_size: 20 }) => {
    console.log(params)
    const { selectedGestionId } = get();
    if (!selectedGestionId) {
      set({
        docentesGestionResponse: {
          ok: false,
          message: "Seleccione una gestión primero.",
        },
      });
      return;
    }

    set({ isLoadingDocentesGestion: true });

    try {
      const response = await getDocentesGestion(selectedGestionId, params);
      console.log("Respuesta docentes:", response);

      if (response.ok && response.data) {
        const { docentes, paginacion, filtros_aplicados } = response.data;
        set({
          docentesGestion: docentes,
          docentesGestionPaginacion: paginacion,
          docentesGestionFiltros: filtros_aplicados,
          docentesGestionResponse: { ok: true, message: response.message },
          hasLoadedDocentesGestion: true,
          isLoadingDocentesGestion: false,
        });
      } else {
        set({
          docentesGestionResponse: {
            ok: false,
            message: response.message || "No se pudieron obtener los docentes",
          },
          isLoadingDocentesGestion: false,
        });
      }
    } catch (e) {
      console.error("Error en fetchDocentes:", e);
      set({
        docentesGestionResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingDocentesGestion: false,
      });
    }
  },

  clearDocentesGestion: () =>
    set({
      docentesGestion: [],
      docentesGestionPaginacion: {
        total_registros: 0,
        total_paginas: 0,
        pagina_actual: 1,
        registros_por_pagina: 20,
        tiene_siguiente: false,
        tiene_anterior: false,
      },
      docentesGestionFiltros: {
        nombre_docente: null,
      },
      hasLoadedDocentesGestion: false,
      docentesGestionResponse: initialResponse,
    }),

  // ============================================
  // GRUPOS/MATERIAS (PAGINADO)
  // ============================================
  gruposMateriasGestion: [],
  gruposGestionPaginacion: {
    total_registros: 0,
    total_paginas: 0,
    pagina_actual: 1,
    registros_por_pagina: 20,
    tiene_siguiente: false,
    tiene_anterior: false,
  },
  gruposGestionFiltros: {
    search: null,
  },
  isLoadingGruposGestion: false,
  hasLoadedGruposGestion: false,
  gruposGestionResponse: initialResponse,

  fetchGruposMateriasGestion: async (params = { page: 1, page_size: 20 }) => {
    const { selectedGestionId } = get();
    if (!selectedGestionId) {
      set({
        gruposGestionResponse: {
          ok: false,
          message: "Seleccione una gestión primero.",
        },
      });
      return;
    }

    set({ isLoadingGruposGestion: true });

    try {
      const response = await getGruposGestion(selectedGestionId, params);
      console.log("Respuesta grupos:", response);

      if (response.ok && response.data) {
        const { grupos_materias, paginacion, filtros_aplicados } =
          response.data;
        set({
          gruposMateriasGestion: grupos_materias,
          gruposGestionPaginacion: paginacion,
          gruposGestionFiltros: filtros_aplicados,
          gruposGestionResponse: { ok: true, message: response.message },
          hasLoadedGruposGestion: true,
          isLoadingGruposGestion: false,
        });
      } else {
        set({
          gruposGestionResponse: {
            ok: false,
            message: response.message || "No se pudieron obtener los grupos",
          },
          isLoadingGruposGestion: false,
        });
      }
    } catch (e) {
      console.error("Error en fetchGrupos:", e);
      set({
        gruposGestionResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingGruposGestion: false,
      });
    }
  },

  clearGruposMateriasGestion: () =>
    set({
      gruposMateriasGestion: [],
      gruposGestionPaginacion: {
        total_registros: 0,
        total_paginas: 0,
        pagina_actual: 1,
        registros_por_pagina: 20,
        tiene_siguiente: false,
        tiene_anterior: false,
      },
      gruposGestionFiltros: {
        search: null,
      },
      hasLoadedGruposGestion: false,
      gruposGestionResponse: initialResponse,
    }),
});
