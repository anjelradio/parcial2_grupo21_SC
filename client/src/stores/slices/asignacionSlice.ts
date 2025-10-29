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
  asignaciones: Asignacion[];
  selectedAsignacion: Asignacion | null;
  hasLoadedAsignaciones: boolean;
  isLoadingAsignaciones: boolean;
  asignacionesResponse: { ok: boolean; message: string };

  createAsignacion: (data: CreateAsignacionData) => Promise<boolean>;
  isCreatingAsignacion: boolean;
  createAsignacionResponse: { ok: boolean; message: string };
  createAsignacionConflictos: ConflictoAgrupado[] | null;
  clearCreateAsignacionResponse: () => void;

  updateAsignacion: (id: number, data: UpdateAsignacionData) => Promise<boolean>;
  isUpdatingAsignacion: boolean;
  updateAsignacionResponse: { ok: boolean; message: string };
  updateAsignacionConflictos: ConflictoAgrupado[] | null;
  clearUpdateAsignacionResponse: () => void;

  deleteAsignacion: (id: number) => Promise<boolean>;
  isDeletingAsignacion: boolean;
  deleteAsignacionResponse: { ok: boolean; message: string };
  clearDeleteAsignacionResponse: () => void;

  fetchAsignaciones: (force?: boolean) => Promise<void>;
  selectAsignacion: (id: number) => void;
  clearSelectedAsignacion: () => void;
  clearAsignaciones: () => void;
};

export const createAsignacionSlice: StateCreator<AsignacionSliceType> = (
  set,
  get
) => ({
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
    if (hasLoadedAsignaciones && !force) {
      console.log("Asignaciones ya cargadas, saltando fetch");
      return;
    }

    console.log("Iniciando fetchAsignaciones...");
    set({ isLoadingAsignaciones: true });

    try {
      const response = await getAllAsignaciones();
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
        console.log("Asignaciones cargadas exitosamente:", response.data.length);
        set({
          asignaciones: response.data,
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