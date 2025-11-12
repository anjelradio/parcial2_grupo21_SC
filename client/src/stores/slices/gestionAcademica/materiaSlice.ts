import type { StateCreator } from "zustand";
import type { Materia, CreateMateriaData, UpdateMateriaData } from "../../../types";
import {
  getAllMaterias,
  createMateria,
  updateMateria,
  deleteMateria,
} from "../../../api/materiaService";

const initialResponse = { ok: false, message: "" };

export type MateriaSliceType = {
  // Estado principal
  materias: Materia[];
  selectedMateria: Materia | null;
  hasLoadedMaterias: boolean;
  isLoadingMaterias: boolean;
  materiasResponse: { ok: boolean; message: string };

  // CREATE
  createMateria: (data: CreateMateriaData) => Promise<boolean>;
  isCreatingMateria: boolean;
  createMateriaResponse: { ok: boolean; message: string };
  clearCreateMateriaResponse: () => void;

  // UPDATE
  updateMateria: (id: number, data: UpdateMateriaData) => Promise<boolean>;
  isUpdatingMateria: boolean;
  updateMateriaResponse: { ok: boolean; message: string };
  clearUpdateMateriaResponse: () => void;

  // DELETE
  deleteMateria: (id: number) => Promise<boolean>;
  isDeletingMateria: boolean;
  deleteMateriaResponse: { ok: boolean; message: string };
  clearDeleteMateriaResponse: () => void;

  // Acciones generales
  fetchMaterias: (force?: boolean) => Promise<void>;
  selectMateria: (id: number) => void;
  clearSelectedMateria: () => void;
  clearMaterias: () => void;
};

export const createMateriaSlice: StateCreator<MateriaSliceType> = (set, get) => ({
  // Estado inicial
  materias: [],
  selectedMateria: null,
  hasLoadedMaterias: false,
  isLoadingMaterias: false,
  materiasResponse: initialResponse,

  isCreatingMateria: false,
  createMateriaResponse: initialResponse,

  isUpdatingMateria: false,
  updateMateriaResponse: initialResponse,

  isDeletingMateria: false,
  deleteMateriaResponse: initialResponse,

  fetchMaterias: async (force = false) => {
    const { hasLoadedMaterias } = get();
    if (hasLoadedMaterias && !force) return;

    set({ isLoadingMaterias: true });

    try {
      const response = await getAllMaterias();

      if (!response) {
        set({
          isLoadingMaterias: false,
          materiasResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        set({
          materias: response.data,
          hasLoadedMaterias: true,
          materiasResponse: { ok: true, message: response.message },
          isLoadingMaterias: false,
        });
      } else {
        set({
          materiasResponse: {
            ok: false,
            message: response.message || "Error al obtener materias",
          },
          isLoadingMaterias: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchMaterias:", error);
      set({
        materiasResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingMaterias: false,
      });
    }
  },

  createMateria: async (data) => {
    set({
      isCreatingMateria: true,
      createMateriaResponse: initialResponse,
    });

    try {
      const response = await createMateria(data);

      if (!response) {
        set({
          createMateriaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isCreatingMateria: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          materias: [...state.materias, response.data!],
          createMateriaResponse: {
            ok: true,
            message: response.message,
          },
          isCreatingMateria: false,
        }));

        return true;
      }

      set({
        createMateriaResponse: {
          ok: false,
          message: response.message || "Error al crear la materia",
        },
        isCreatingMateria: false,
      });
      return false;
    } catch (error) {
      console.error("Error en createMateria:", error);
      set({
        createMateriaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingMateria: false,
      });
      return false;
    }
  },

  updateMateria: async (id, data) => {
    set({
      isUpdatingMateria: true,
      updateMateriaResponse: initialResponse,
    });

    try {
      const response = await updateMateria(id, data);

      if (!response) {
        set({
          updateMateriaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingMateria: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          materias: state.materias.map((materia) =>
            materia.id_materia === id ? response.data! : materia
          ),
          selectedMateria:
            state.selectedMateria?.id_materia === id
              ? response.data
              : state.selectedMateria,
          updateMateriaResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingMateria: false,
        }));

        return true;
      }

      set({
        updateMateriaResponse: {
          ok: false,
          message: response.message || "Error al actualizar la materia",
        },
        isUpdatingMateria: false,
      });
      return false;
    } catch (error) {
      console.error("Error en updateMateria:", error);
      set({
        updateMateriaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingMateria: false,
      });
      return false;
    }
  },

  deleteMateria: async (id) => {
    set({
      isDeletingMateria: true,
      deleteMateriaResponse: initialResponse,
    });

    try {
      const response = await deleteMateria(id);

      if (!response) {
        set({
          deleteMateriaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isDeletingMateria: false,
        });
        return false;
      }

      if (response.ok) {
        set((state) => ({
          materias: state.materias.filter((materia) => materia.id_materia !== id),
          deleteMateriaResponse: {
            ok: true,
            message: response.message,
          },
          isDeletingMateria: false,
        }));

        setTimeout(() => {
          const { selectedMateria } = get();
          if (selectedMateria?.id_materia === id) {
            set({ selectedMateria: null });
          }
        }, 300);

        return true;
      }

      set({
        deleteMateriaResponse: {
          ok: false,
          message: response.message || "Error al eliminar la materia",
        },
        isDeletingMateria: false,
      });
      return false;
    } catch (error) {
      console.error("Error en deleteMateria:", error);
      set({
        deleteMateriaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingMateria: false,
      });
      return false;
    }
  },

  selectMateria: (id) => {
    const { materias } = get();
    const selectedMateria = materias.find((materia) => materia.id_materia === id);

    if (selectedMateria) {
      set({ selectedMateria });
    } else {
      console.warn("Materia no encontrada:", id);
    }
  },

  clearSelectedMateria: () => set({ selectedMateria: null }),
  clearCreateMateriaResponse: () => set({ createMateriaResponse: initialResponse }),
  clearUpdateMateriaResponse: () => set({ updateMateriaResponse: initialResponse }),
  clearDeleteMateriaResponse: () => set({ deleteMateriaResponse: initialResponse }),
  clearMaterias: () =>
    set({
      materias: [],
      hasLoadedMaterias: false,
      materiasResponse: initialResponse,
    }),
});