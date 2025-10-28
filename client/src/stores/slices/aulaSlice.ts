import type { StateCreator } from "zustand";
import type { Aula, CreateAulaData, UpdateAulaData } from "../../types";
import {
  getAllAulas,
  createAula,
  updateAula,
  deleteAula,
} from "../../api/aulaService";

const initialResponse = { ok: false, message: "" };

export type AulaSliceType = {
  // Estado principal
  aulas: Aula[];
  selectedAula: Aula | null;
  hasLoadedAulas: boolean;
  isLoadingAulas: boolean;
  aulasResponse: { ok: boolean; message: string };

  // CREATE
  createAula: (data: CreateAulaData) => Promise<boolean>;
  isCreatingAula: boolean;
  createAulaResponse: { ok: boolean; message: string };
  clearCreateAulaResponse: () => void;

  // UPDATE
  updateAula: (nroAula: string, data: UpdateAulaData) => Promise<boolean>;
  isUpdatingAula: boolean;
  updateAulaResponse: { ok: boolean; message: string };
  clearUpdateAulaResponse: () => void;

  // DELETE
  deleteAula: (nroAula: string) => Promise<boolean>;
  isDeletingAula: boolean;
  deleteAulaResponse: { ok: boolean; message: string };
  clearDeleteAulaResponse: () => void;

  // Acciones generales
  fetchAulas: (force?: boolean) => Promise<void>;
  selectAula: (nroAula: string) => void;
  clearSelectedAula: () => void;
  clearAulas: () => void;
};

export const createAulaSlice: StateCreator<AulaSliceType> = (set, get) => ({
  // Estado inicial
  aulas: [],
  selectedAula: null,
  hasLoadedAulas: false,
  isLoadingAulas: false,
  aulasResponse: initialResponse,

  isCreatingAula: false,
  createAulaResponse: initialResponse,

  isUpdatingAula: false,
  updateAulaResponse: initialResponse,

  isDeletingAula: false,
  deleteAulaResponse: initialResponse,

  fetchAulas: async (force = false) => {
    const { hasLoadedAulas } = get();
    if (hasLoadedAulas && !force) return;

    set({ isLoadingAulas: true });

    try {
      const response = await getAllAulas();

      if (!response) {
        set({
          isLoadingAulas: false,
          aulasResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        set({
          aulas: response.data,
          hasLoadedAulas: true,
          aulasResponse: { ok: true, message: response.message },
          isLoadingAulas: false,
        });
      } else {
        set({
          aulasResponse: {
            ok: false,
            message: response.message || "Error al obtener aulas",
          },
          isLoadingAulas: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchAulas:", error);
      set({
        aulasResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingAulas: false,
      });
    }
  },

  createAula: async (data) => {
    set({
      isCreatingAula: true,
      createAulaResponse: initialResponse,
    });

    try {
      const response = await createAula(data);

      if (!response) {
        set({
          createAulaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isCreatingAula: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          aulas: [...state.aulas, response.data!],
          createAulaResponse: {
            ok: true,
            message: response.message,
          },
          isCreatingAula: false,
        }));

        return true;
      }

      set({
        createAulaResponse: {
          ok: false,
          message: response.message || "Error al crear el aula",
        },
        isCreatingAula: false,
      });
      return false;
    } catch (error) {
      console.error("Error en createAula:", error);
      set({
        createAulaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingAula: false,
      });
      return false;
    }
  },

  updateAula: async (nroAula, data) => {
    set({
      isUpdatingAula: true,
      updateAulaResponse: initialResponse,
    });

    try {
      const response = await updateAula(nroAula, data);

      if (!response) {
        set({
          updateAulaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingAula: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          aulas: state.aulas.map((aula) =>
            aula.nro_aula === nroAula ? response.data! : aula
          ),
          selectedAula:
            state.selectedAula?.nro_aula === nroAula
              ? response.data
              : state.selectedAula,
          updateAulaResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingAula: false,
        }));

        return true;
      }

      set({
        updateAulaResponse: {
          ok: false,
          message: response.message || "Error al actualizar el aula",
        },
        isUpdatingAula: false,
      });
      return false;
    } catch (error) {
      console.error("Error en updateAula:", error);
      set({
        updateAulaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingAula: false,
      });
      return false;
    }
  },

  deleteAula: async (nroAula) => {
    set({
      isDeletingAula: true,
      deleteAulaResponse: initialResponse,
    });

    try {
      const response = await deleteAula(nroAula);

      if (!response) {
        set({
          deleteAulaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isDeletingAula: false,
        });
        return false;
      }

      if (response.ok) {
        set((state) => ({
          aulas: state.aulas.filter((aula) => aula.nro_aula !== nroAula),
          deleteAulaResponse: {
            ok: true,
            message: response.message,
          },
          isDeletingAula: false,
        }));

        setTimeout(() => {
          const { selectedAula } = get();
          if (selectedAula?.nro_aula === nroAula) {
            set({ selectedAula: null });
          }
        }, 300);

        return true;
      }

      set({
        deleteAulaResponse: {
          ok: false,
          message: response.message || "Error al eliminar el aula",
        },
        isDeletingAula: false,
      });
      return false;
    } catch (error) {
      console.error("Error en deleteAula:", error);
      set({
        deleteAulaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingAula: false,
      });
      return false;
    }
  },

  selectAula: (nroAula) => {
    const { aulas } = get();
    const selectedAula = aulas.find((aula) => aula.nro_aula === nroAula);

    if (selectedAula) {
      set({ selectedAula });
    } else {
      console.warn("Aula no encontrada:", nroAula);
    }
  },

  clearSelectedAula: () => set({ selectedAula: null }),
  clearCreateAulaResponse: () => set({ createAulaResponse: initialResponse }),
  clearUpdateAulaResponse: () => set({ updateAulaResponse: initialResponse }),
  clearDeleteAulaResponse: () => set({ deleteAulaResponse: initialResponse }),
  clearAulas: () =>
    set({
      aulas: [],
      hasLoadedAulas: false,
      aulasResponse: initialResponse,
    }),
});
