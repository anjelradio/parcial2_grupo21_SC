import type { StateCreator } from "zustand";
import type { Grupo, CreateGrupoData, UpdateGrupoData } from "../../../types";
import {
  getAllGrupos,
  createGrupo,
  updateGrupo,
  deleteGrupo,
} from "../../../api/grupoService";

const initialResponse = { ok: false, message: "" };

export type GrupoSliceType = {
  // Estado principal
  grupos: Grupo[];
  selectedGrupo: Grupo | null;
  hasLoadedGrupos: boolean;
  isLoadingGrupos: boolean;
  gruposResponse: { ok: boolean; message: string };

  // CREATE
  createGrupo: (data: CreateGrupoData) => Promise<boolean>;
  isCreatingGrupo: boolean;
  createGrupoResponse: { ok: boolean; message: string };
  clearCreateGrupoResponse: () => void;

  // UPDATE
  updateGrupo: (id: number, data: UpdateGrupoData) => Promise<boolean>;
  isUpdatingGrupo: boolean;
  updateGrupoResponse: { ok: boolean; message: string };
  clearUpdateGrupoResponse: () => void;

  // DELETE
  deleteGrupo: (id: number) => Promise<boolean>;
  isDeletingGrupo: boolean;
  deleteGrupoResponse: { ok: boolean; message: string };
  clearDeleteGrupoResponse: () => void;

  // Acciones generales
  fetchGrupos: (force?: boolean) => Promise<void>;
  selectGrupo: (id: number) => void;
  clearSelectedGrupo: () => void;
  clearGrupos: () => void;
};

export const createGrupoSlice: StateCreator<GrupoSliceType> = (set, get) => ({
  // Estado inicial
  grupos: [],
  selectedGrupo: null,
  hasLoadedGrupos: false,
  isLoadingGrupos: false,
  gruposResponse: initialResponse,

  isCreatingGrupo: false,
  createGrupoResponse: initialResponse,

  isUpdatingGrupo: false,
  updateGrupoResponse: initialResponse,

  isDeletingGrupo: false,
  deleteGrupoResponse: initialResponse,

  fetchGrupos: async (force = false) => {
    const { hasLoadedGrupos } = get();
    if (hasLoadedGrupos && !force) return;

    set({ isLoadingGrupos: true });

    try {
      const response = await getAllGrupos();

      if (!response) {
        set({
          isLoadingGrupos: false,
          gruposResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        set({
          grupos: response.data,
          hasLoadedGrupos: true,
          gruposResponse: { ok: true, message: response.message },
          isLoadingGrupos: false,
        });
      } else {
        set({
          gruposResponse: {
            ok: false,
            message: response.message || "Error al obtener grupos",
          },
          isLoadingGrupos: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchGrupos:", error);
      set({
        gruposResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingGrupos: false,
      });
    }
  },

  createGrupo: async (data) => {
    set({
      isCreatingGrupo: true,
      createGrupoResponse: initialResponse,
    });

    try {
      const response = await createGrupo(data);

      if (!response) {
        set({
          createGrupoResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isCreatingGrupo: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          grupos: [...state.grupos, response.data!],
          createGrupoResponse: {
            ok: true,
            message: response.message,
          },
          isCreatingGrupo: false,
        }));

        return true;
      }

      set({
        createGrupoResponse: {
          ok: false,
          message: response.message || "Error al crear el grupo",
        },
        isCreatingGrupo: false,
      });
      return false;
    } catch (error) {
      console.error("Error en createGrupo:", error);
      set({
        createGrupoResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingGrupo: false,
      });
      return false;
    }
  },

  updateGrupo: async (id, data) => {
    set({
      isUpdatingGrupo: true,
      updateGrupoResponse: initialResponse,
    });

    try {
      const response = await updateGrupo(id, data);

      if (!response) {
        set({
          updateGrupoResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingGrupo: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          grupos: state.grupos.map((grupo) =>
            grupo.id_grupo === id ? response.data! : grupo
          ),
          selectedGrupo:
            state.selectedGrupo?.id_grupo === id
              ? response.data
              : state.selectedGrupo,
          updateGrupoResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingGrupo: false,
        }));

        return true;
      }

      set({
        updateGrupoResponse: {
          ok: false,
          message: response.message || "Error al actualizar el grupo",
        },
        isUpdatingGrupo: false,
      });
      return false;
    } catch (error) {
      console.error("Error en updateGrupo:", error);
      set({
        updateGrupoResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingGrupo: false,
      });
      return false;
    }
  },

  deleteGrupo: async (id) => {
    set({
      isDeletingGrupo: true,
      deleteGrupoResponse: initialResponse,
    });

    try {
      const response = await deleteGrupo(id);

      if (!response) {
        set({
          deleteGrupoResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isDeletingGrupo: false,
        });
        return false;
      }

      if (response.ok) {
        set((state) => ({
          grupos: state.grupos.filter((grupo) => grupo.id_grupo !== id),
          deleteGrupoResponse: {
            ok: true,
            message: response.message,
          },
          isDeletingGrupo: false,
        }));

        setTimeout(() => {
          const { selectedGrupo } = get();
          if (selectedGrupo?.id_grupo === id) {
            set({ selectedGrupo: null });
          }
        }, 300);

        return true;
      }

      set({
        deleteGrupoResponse: {
          ok: false,
          message: response.message || "Error al eliminar el grupo",
        },
        isDeletingGrupo: false,
      });
      return false;
    } catch (error) {
      console.error("Error en deleteGrupo:", error);
      set({
        deleteGrupoResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingGrupo: false,
      });
      return false;
    }
  },

  selectGrupo: (id) => {
    const { grupos } = get();
    const selectedGrupo = grupos.find((grupo) => grupo.id_grupo === id);

    if (selectedGrupo) {
      set({ selectedGrupo });
    } else {
      console.warn("Grupo no encontrado:", id);
    }
  },

  clearSelectedGrupo: () => set({ selectedGrupo: null }),
  clearCreateGrupoResponse: () => set({ createGrupoResponse: initialResponse }),
  clearUpdateGrupoResponse: () => set({ updateGrupoResponse: initialResponse }),
  clearDeleteGrupoResponse: () => set({ deleteGrupoResponse: initialResponse }),
  clearGrupos: () =>
    set({
      grupos: [],
      hasLoadedGrupos: false,
      gruposResponse: initialResponse,
    }),
});