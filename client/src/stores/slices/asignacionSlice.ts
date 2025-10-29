import type { StateCreator } from "zustand";
import type {
  Asignacion,
  CreateAsignacionData,
  UpdateAsignacionData,
  ConflictoAgrupado,
} from "../../types";
import {
  getAllAsignaciones,
  createAsignacion,
  updateAsignacion,
  deleteAsignacion,
} from "../../api/asignacionService";

const initialResponse = { ok: false, message: "" };

export type AsignacionSliceType = {
  // Estado principal
  asignaciones: Asignacion[];
  selectedAsignacion: Asignacion | null;
  hasLoadedAsignaciones: boolean;
  isLoadingAsignaciones: boolean;
  asignacionesResponse: { ok: boolean; message: string };

  // CREATE
  createAsignacion: (data: CreateAsignacionData) => Promise<boolean>;
  isCreatingAsignacion: boolean;
  createAsignacionResponse: { ok: boolean; message: string };
  createAsignacionConflictos: ConflictoAgrupado[] | null;
  clearCreateAsignacionResponse: () => void;

  // UPDATE
  updateAsignacion: (id: number, data: UpdateAsignacionData) => Promise<boolean>;
  isUpdatingAsignacion: boolean;
  updateAsignacionResponse: { ok: boolean; message: string };
  updateAsignacionConflictos: ConflictoAgrupado[] | null;
  clearUpdateAsignacionResponse: () => void;

  // DELETE
  deleteAsignacion: (id: number) => Promise<boolean>;
  isDeletingAsignacion: boolean;
  deleteAsignacionResponse: { ok: boolean; message: string };
  clearDeleteAsignacionResponse: () => void;

  // Acciones generales
  fetchAsignaciones: (force?: boolean) => Promise<void>;
  selectAsignacion: (id: number) => void;
  clearSelectedAsignacion: () => void;
  clearAsignaciones: () => void;
};

export const createAsignacionSlice: StateCreator<AsignacionSliceType> = (
  set,
  get
) => ({
  // Estado inicial
  asignaciones: [],
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

  fetchAsignaciones: async (force = false) => {
    const { hasLoadedAsignaciones } = get();
    if (hasLoadedAsignaciones && !force) return;

    set({ isLoadingAsignaciones: true });

    try {
      const response = await getAllAsignaciones();

      if (!response) {
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
        set({
          asignaciones: response.data,
          hasLoadedAsignaciones: true,
          asignacionesResponse: { ok: true, message: response.message },
          isLoadingAsignaciones: false,
        });
      } else {
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

      // Verificar si hay conflictos usando type narrowing
      if (!response.ok && "data" in response && response.data && "conflictos" in response.data) {
        set({
          createAsignacionResponse: {
            ok: false,
            message: response.message,
          },
          createAsignacionConflictos: response.data.conflictos,
          isCreatingAsignacion: false,
        });
        return false;
      }

      // Si la respuesta es exitosa
      if (response.ok && "data" in response && response.data) {
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

      // Verificar si hay conflictos usando type narrowing
      if (!response.ok && "data" in response && response.data && "conflictos" in response.data) {
        set({
          updateAsignacionResponse: {
            ok: false,
            message: response.message,
          },
          updateAsignacionConflictos: response.data.conflictos,
          isUpdatingAsignacion: false,
        });
        return false;
      }

      // Si la respuesta es exitosa
      if (response.ok && "data" in response && response.data) {
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