import type { StateCreator } from "zustand";
import type {
  Asignacion,
  CreateAsignacionData,
  UpdateAsignacionData,
  ConflictoAgrupado,
  Paginacion,
  FiltrosAplicadosAsignaciones,
} from "../../../types";
import {
  getAllAsignaciones,
  createAsignacion,
  updateAsignacion,
  deleteAsignacion,
} from "../../../api/asignacionService";

const initialResponse = { ok: false, message: "" };

export type AsignacionSliceType = {
  asignaciones: Asignacion[];
  selectedAsignacion: Asignacion | null;
  hasLoadedAsignaciones: boolean;
  isLoadingAsignaciones: boolean;
  asignacionesResponse: { ok: boolean; message: string };
  asignacionesPaginacion: Paginacion;
  asignacionesFiltros: FiltrosAplicadosAsignaciones;

  createAsignacion: (data: CreateAsignacionData) => Promise<boolean>;
  isCreatingAsignacion: boolean;
  createAsignacionResponse: { ok: boolean; message: string };
  createAsignacionConflictos: ConflictoAgrupado[] | null;
  clearCreateAsignacionResponse: () => void;

  updateAsignacion: (
    id: number,
    data: UpdateAsignacionData
  ) => Promise<boolean>;
  isUpdatingAsignacion: boolean;
  updateAsignacionResponse: { ok: boolean; message: string };
  updateAsignacionConflictos: ConflictoAgrupado[] | null;
  clearUpdateAsignacionResponse: () => void;

  deleteAsignacion: (id: number) => Promise<boolean>;
  isDeletingAsignacion: boolean;
  deleteAsignacionResponse: { ok: boolean; message: string };
  clearDeleteAsignacionResponse: () => void;

  fetchAsignaciones: (params?: {
    page?: number;
    page_size?: number;
    nombre_docente?: string;
    id_gestion?: number;
    semestre?: number;
    force?: boolean;
  }) => Promise<void>;
  selectAsignacion: (id: number) => void;
  clearSelectedAsignacion: () => void;
  clearAsignaciones: () => void;
};

export const createAsignacionSlice: StateCreator<AsignacionSliceType> = (
  set,
  get
) => ({
  asignaciones: [],
  asignacionesPaginacion: {
    total_registros: 0,
    total_paginas: 0,
    pagina_actual: 1,
    registros_por_pagina: 20,
    tiene_siguiente: false,
    tiene_anterior: false,
  },
  asignacionesFiltros: {
    id_gestion: null,
    nombre_docente: null,
    semestre: null,
  },
  selectedAsignacion: null,
  hasLoadedAsignaciones: false,
  isLoadingAsignaciones: false,
  asignacionesResponse: initialResponse,

  isCreatingAsignacion: false,
  createAsignacionResponse: initialResponse,
  createAsignacionConflictos: null,

  isUpdatingAsignacion: false,
  updateAsignacionResponse: initialResponse,
  updateAsignacionConflictos: null,

  isDeletingAsignacion: false,
  deleteAsignacionResponse: initialResponse,

  fetchAsignaciones: async (params = { page: 1, page_size: 9 }) => {
    const { hasLoadedAsignaciones } = get();

    // Prevent re-fetch ONLY when we are on the first page without filters
    const force = params.force ?? false;

    const isFirstPageWithoutFilters =
      params.page === 1 &&
      !params.nombre_docente &&
      !params.id_gestion &&
      !params.semestre;

    if (hasLoadedAsignaciones && !force && isFirstPageWithoutFilters) {
      console.log(
        "Asignaciones ya cargadas en página 1 sin filtros, saltando fetch"
      );
      return;
    }

    console.log("Iniciando fetchAsignaciones con params:", params);
    set({ isLoadingAsignaciones: true });

    const { force: _force, ...queryParams } = params;

    try {
      const response = await getAllAsignaciones(queryParams);
      console.log("Respuesta de getAllAsignaciones:", response);

      if (!response) {
        console.error("No se recibió respuesta del servidor");
        set({
          isLoadingAsignaciones: false,
          asignacionesResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        const { asignaciones, paginacion, filtros_aplicados } = response.data;

        console.log(
          "Asignaciones cargadas exitosamente:",
          asignaciones.length,
          "paginación:",
          paginacion
        );

        set({
          asignaciones,
          asignacionesPaginacion: paginacion,
          asignacionesFiltros: filtros_aplicados,
          hasLoadedAsignaciones: true,
          asignacionesResponse: { ok: true, message: response.message },
          isLoadingAsignaciones: false,
        });
      } else {
        console.error("Error en respuesta:", response.message);
        set({
          asignacionesResponse: {
            ok: false,
            message: response.message || "Error al obtener asignaciones",
          },
          isLoadingAsignaciones: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchAsignaciones:", error);
      set({
        asignacionesResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingAsignaciones: false,
      });
    }
  },

  createAsignacion: async (data) => {
    set({
      isCreatingAsignacion: true,
      createAsignacionResponse: initialResponse,
      createAsignacionConflictos: null,
    });

    try {
      const response = await createAsignacion(data);
      console.log("Respuesta createAsignacion:", response);

      if (!response) {
        set({
          createAsignacionResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isCreatingAsignacion: false,
        });
        return false;
      }

      // Caso: Error con conflictos
      if (!response.ok && response.data) {
        const responseData = response.data as any;
        if (responseData.conflictos && Array.isArray(responseData.conflictos)) {
          set({
            createAsignacionResponse: {
              ok: false,
              message: response.message,
            },
            createAsignacionConflictos: responseData.conflictos,
            isCreatingAsignacion: false,
          });
          return false;
        }
      }

      // Caso: Éxito
      if (response.ok && response.data) {
        const newAsignacion = response.data as Asignacion;

        set((state) => ({
          asignaciones: [...state.asignaciones, newAsignacion],
          createAsignacionResponse: {
            ok: true,
            message: response.message,
          },
          createAsignacionConflictos: null,
          isCreatingAsignacion: false,
        }));

        return true;
      }

      // Caso: Error genérico
      set({
        createAsignacionResponse: {
          ok: false,
          message: response.message || "Error al crear la asignación",
        },
        isCreatingAsignacion: false,
      });
      return false;
    } catch (error) {
      console.error("Error en createAsignacion:", error);
      set({
        createAsignacionResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingAsignacion: false,
      });
      return false;
    }
  },

  updateAsignacion: async (id, data) => {
    set({
      isUpdatingAsignacion: true,
      updateAsignacionResponse: initialResponse,
      updateAsignacionConflictos: null,
    });

    try {
      const response = await updateAsignacion(id, data);
      console.log("Respuesta updateAsignacion:", response);

      if (!response) {
        set({
          updateAsignacionResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingAsignacion: false,
        });
        return false;
      }

      // Caso: Error con conflictos
      if (!response.ok && response.data) {
        const responseData = response.data as any;
        if (responseData.conflictos && Array.isArray(responseData.conflictos)) {
          set({
            updateAsignacionResponse: {
              ok: false,
              message: response.message,
            },
            updateAsignacionConflictos: responseData.conflictos,
            isUpdatingAsignacion: false,
          });
          return false;
        }
      }

      // Caso: Éxito
      if (response.ok && response.data) {
        const updatedAsignacion = response.data as Asignacion;

        set((state) => ({
          asignaciones: state.asignaciones.map((asignacion) =>
            asignacion.id_asignacion === id ? updatedAsignacion : asignacion
          ),
          selectedAsignacion:
            state.selectedAsignacion?.id_asignacion === id
              ? updatedAsignacion
              : state.selectedAsignacion,
          updateAsignacionResponse: {
            ok: true,
            message: response.message,
          },
          updateAsignacionConflictos: null,
          isUpdatingAsignacion: false,
        }));

        return true;
      }

      // Caso: Error genérico
      set({
        updateAsignacionResponse: {
          ok: false,
          message: response.message || "Error al actualizar la asignación",
        },
        isUpdatingAsignacion: false,
      });
      return false;
    } catch (error) {
      console.error("Error en updateAsignacion:", error);
      set({
        updateAsignacionResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingAsignacion: false,
      });
      return false;
    }
  },

  deleteAsignacion: async (id) => {
    set({
      isDeletingAsignacion: true,
      deleteAsignacionResponse: initialResponse,
    });

    try {
      const response = await deleteAsignacion(id);
      console.log("Respuesta deleteAsignacion:", response);

      if (!response) {
        set({
          deleteAsignacionResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isDeletingAsignacion: false,
        });
        return false;
      }

      if (response.ok) {
        set((state) => ({
          asignaciones: state.asignaciones.filter(
            (asignacion) => asignacion.id_asignacion !== id
          ),
          deleteAsignacionResponse: {
            ok: true,
            message: response.message,
          },
          isDeletingAsignacion: false,
        }));

        setTimeout(() => {
          const { selectedAsignacion } = get();
          if (selectedAsignacion?.id_asignacion === id) {
            set({ selectedAsignacion: null });
          }
        }, 300);

        return true;
      }

      set({
        deleteAsignacionResponse: {
          ok: false,
          message: response.message || "Error al eliminar la asignación",
        },
        isDeletingAsignacion: false,
      });
      return false;
    } catch (error) {
      console.error("Error en deleteAsignacion:", error);
      set({
        deleteAsignacionResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingAsignacion: false,
      });
      return false;
    }
  },

  selectAsignacion: (id) => {
    const { asignaciones } = get();
    const selectedAsignacion = asignaciones.find(
      (asignacion) => asignacion.id_asignacion === id
    );

    if (selectedAsignacion) {
      set({ selectedAsignacion });
    } else {
      console.warn("Asignación no encontrada:", id);
    }
  },

  clearSelectedAsignacion: () => set({ selectedAsignacion: null }),
  clearCreateAsignacionResponse: () =>
    set({
      createAsignacionResponse: initialResponse,
      createAsignacionConflictos: null,
    }),
  clearUpdateAsignacionResponse: () =>
    set({
      updateAsignacionResponse: initialResponse,
      updateAsignacionConflictos: null,
    }),
  clearDeleteAsignacionResponse: () =>
    set({ deleteAsignacionResponse: initialResponse }),
  clearAsignaciones: () =>
    set({
      asignaciones: [],
      hasLoadedAsignaciones: false,
      asignacionesResponse: initialResponse,
    }),
});
