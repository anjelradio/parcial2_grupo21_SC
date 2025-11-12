import type { StateCreator } from "zustand";
import type {
  Suplencia,
  Paginacion,
  FiltrosAplicadosSuplencias,
  CreateSuplenciaData,
  UpdateSuplenciaData,
} from "../../../types";
import {
  getAllSuplencias,
  createSuplencia,
  updateSuplencia,
  deleteSuplencia,
} from "../../../api/suplenciasService";

const initialResponse = { ok: false, message: "" };

export type SuplenciasSliceType = {
  // ============================================
  // SUPLENCIAS - LISTA PAGINADA
  // ============================================
  suplencias: Suplencia[];
  suplenciasPaginacion: Paginacion;
  suplenciasFiltros: FiltrosAplicadosSuplencias;
  isLoadingSuplencias: boolean;
  hasLoadedSuplencias: boolean;
  suplenciasResponse: { ok: boolean; message: string };

  fetchSuplencias: (params?: {
    page?: number;
    page_size?: number;
    nombre_titular?: string;
    id_gestion?: number | string;
  }) => Promise<void>;

  clearSuplencias: () => void;

  // ============================================
  // SELECCIÓN DE SUPLENCIA
  // ============================================
  selectedSuplencia: Suplencia | null;
  selectSuplencia: (id: number) => void;
  clearSelectedSuplencia: () => void;

  // ============================================
  // CREAR SUPLENCIA
  // ============================================
  createNewSuplencia: (data: CreateSuplenciaData) => Promise<boolean>;
  isCreatingSuplencia: boolean;
  createSuplenciaResponse: { ok: boolean; message: string };
  clearCreateSuplenciaResponse: () => void;

  // ============================================
  // ACTUALIZAR SUPLENCIA
  // ============================================
  updateExistingSuplencia: (
    id: number,
    data: UpdateSuplenciaData
  ) => Promise<boolean>;
  isUpdatingSuplencia: boolean;
  updateSuplenciaResponse: { ok: boolean; message: string };
  clearUpdateSuplenciaResponse: () => void;

  // ============================================
  // ELIMINAR SUPLENCIA
  // ============================================
  deleteExistingSuplencia: (id: number) => Promise<boolean>;
  isDeletingSuplencia: boolean;
  deleteSuplenciaResponse: { ok: boolean; message: string };
  clearDeleteSuplenciaResponse: () => void;
};

export const createSuplenciasSlice: StateCreator<SuplenciasSliceType> = (
  set,
  get
) => ({
  // ============================================
  // ESTADO INICIAL
  // ============================================

  suplencias: [],
  suplenciasPaginacion: {
    total_registros: 0,
    total_paginas: 0,
    pagina_actual: 1,
    registros_por_pagina: 10,
    tiene_siguiente: false,
    tiene_anterior: false,
  },
  suplenciasFiltros: {
    nombre_titular: null,
    id_gestion: null,
  },
  isLoadingSuplencias: false,
  hasLoadedSuplencias: false,
  suplenciasResponse: initialResponse,

  selectedSuplencia: null,

  isCreatingSuplencia: false,
  createSuplenciaResponse: initialResponse,

  isUpdatingSuplencia: false,
  updateSuplenciaResponse: initialResponse,

  isDeletingSuplencia: false,
  deleteSuplenciaResponse: initialResponse,

  // ============================================
  // FETCH DE SUPLENCIAS (PAGINADO)
  // ============================================

  fetchSuplencias: async (params = { page: 1, page_size: 9 }) => {
    console.log("🔄 Iniciando fetchSuplencias (paginado)...", params);
    set({ isLoadingSuplencias: true });

    try {
      const response = await getAllSuplencias(params);
      console.log("✅ Respuesta fetchSuplencias:", response);

      if (response.ok && response.data) {
        const { suplencias, paginacion, filtros_aplicados } = response.data;

        set({
          suplencias,
          suplenciasPaginacion: paginacion,
          suplenciasFiltros: filtros_aplicados,
          suplenciasResponse: { ok: true, message: response.message },
          hasLoadedSuplencias: true,
          isLoadingSuplencias: false,
        });
      } else {
        set({
          suplenciasResponse: {
            ok: false,
            message: response.message || "Error al obtener suplencias docentes",
          },
          isLoadingSuplencias: false,
        });
      }
    } catch (error) {
      console.error("❌ Error en fetchSuplencias:", error);
      set({
        suplenciasResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingSuplencias: false,
      });
    }
  },

  // ============================================
  // SELECCIÓN DE SUPLENCIA
  // ============================================

  selectSuplencia: (id) => {
    const { suplencias } = get();
    const selectedSuplencia = suplencias.find((s) => s.id_suplencia === id);

    if (selectedSuplencia) {
      set({ selectedSuplencia });
      console.log("✅ Suplencia seleccionada:", selectedSuplencia);
    } else {
      console.warn("⚠️ Suplencia no encontrada:", id);
    }
  },

  clearSelectedSuplencia: () => {
    set({ selectedSuplencia: null });
  },

  // ============================================
  // CREAR SUPLENCIA
  // ============================================

  createNewSuplencia: async (data) => {
    set({ isCreatingSuplencia: true, createSuplenciaResponse: initialResponse });

    try {
      const response = await createSuplencia(data);

      if (!response || !response.ok || !response.data) {
        set({
          createSuplenciaResponse: {
            ok: false,
            message: response?.message || "Error al crear la suplencia",
          },
          isCreatingSuplencia: false,
        });
        return false;
      }

      const newSuplencia = response.data;

      // Agregar la nueva suplencia al inicio de la lista
      set((state) => ({
        suplencias: [newSuplencia, ...state.suplencias],
        createSuplenciaResponse: { ok: true, message: response.message },
        isCreatingSuplencia: false,
      }));

      console.log("✅ Suplencia creada exitosamente");
      return true;
    } catch (error) {
      console.error("❌ Error en createNewSuplencia:", error);
      set({
        createSuplenciaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingSuplencia: false,
      });
      return false;
    }
  },

  clearCreateSuplenciaResponse: () => {
    set({ createSuplenciaResponse: initialResponse });
  },

  // ============================================
  // ACTUALIZAR SUPLENCIA
  // ============================================

  updateExistingSuplencia: async (id, data) => {
    set({
      isUpdatingSuplencia: true,
      updateSuplenciaResponse: initialResponse,
    });

    try {
      const response = await updateSuplencia(id, data);

      if (!response || !response.ok || !response.data) {
        set({
          updateSuplenciaResponse: {
            ok: false,
            message: response?.message || "Error al actualizar la suplencia",
          },
          isUpdatingSuplencia: false,
        });
        return false;
      }

      const updatedSuplencia = response.data;

      // Actualizar la suplencia en la lista y en la selección
      set((state) => ({
        suplencias: state.suplencias.map((s) =>
          s.id_suplencia === id ? updatedSuplencia : s
        ),
        selectedSuplencia:
          state.selectedSuplencia?.id_suplencia === id
            ? updatedSuplencia
            : state.selectedSuplencia,
        updateSuplenciaResponse: { ok: true, message: response.message },
        isUpdatingSuplencia: false,
      }));

      return true;
    } catch (error) {
      set({
        updateSuplenciaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingSuplencia: false,
      });
      return false;
    }
  },

  clearUpdateSuplenciaResponse: () => {
    set({ updateSuplenciaResponse: initialResponse });
  },

  // ============================================
  // ELIMINAR SUPLENCIA
  // ============================================

  deleteExistingSuplencia: async (id) => {
    set({
      isDeletingSuplencia: true,
      deleteSuplenciaResponse: initialResponse,
    });

    try {
      const response = await deleteSuplencia(id);

      if (!response || !response.ok) {
        set({
          deleteSuplenciaResponse: {
            ok: false,
            message: response?.message || "Error al eliminar la suplencia",
          },
          isDeletingSuplencia: false,
        });
        return false;
      }

      // Remover la suplencia de la lista
      set((state) => ({
        suplencias: state.suplencias.filter((s) => s.id_suplencia !== id),
        selectedSuplencia:
          state.selectedSuplencia?.id_suplencia === id
            ? null
            : state.selectedSuplencia,
        deleteSuplenciaResponse: { ok: true, message: response.message },
        isDeletingSuplencia: false,
      }));

      return true;
    } catch (error) {
      console.error("❌ Error en deleteExistingSuplencia:", error);
      set({
        deleteSuplenciaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingSuplencia: false,
      });
      return false;
    }
  },

  clearDeleteSuplenciaResponse: () => {
    set({ deleteSuplenciaResponse: initialResponse });
  },

  // ============================================
  // LIMPIAR DATOS DE SUPLENCIAS
  // ============================================

  clearSuplencias: () => {
    set({
      suplencias: [],
      suplenciasPaginacion: {
        total_registros: 0,
        total_paginas: 0,
        pagina_actual: 1,
        registros_por_pagina: 10,
        tiene_siguiente: false,
        tiene_anterior: false,
      },
      suplenciasFiltros: {
        nombre_titular: null,
        id_gestion: null,
      },
      hasLoadedSuplencias: false,
      suplenciasResponse: initialResponse,
    });
  },
});