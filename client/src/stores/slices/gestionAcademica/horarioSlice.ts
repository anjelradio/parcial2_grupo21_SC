import type { StateCreator } from "zustand";
import type {
  Dia,
  CreateDiaData,
  UpdateDiaData,
  BloqueHorario,
  CreateBloqueHorarioData,
  UpdateBloqueHorarioData,
} from "../../../types";
import {
  getAllDias,
  createDia,
  updateDia,
  deleteDia,
} from "../../../api/diaService";
import {
  getAllBloquesHorarios,
  createBloqueHorario,
  updateBloqueHorario,
  deleteBloqueHorario,
} from "../../../api/bloqueHorarioService";

const initialResponse = { ok: false, message: "" };

export type HorarioSliceType = {
  // ========== ESTADO DE DÍAS ==========
  dias: Dia[];
  selectedDia: Dia | null;
  hasLoadedDias: boolean;
  isLoadingDias: boolean;
  diasResponse: { ok: boolean; message: string };

  // CREATE DÍA
  createDia: (data: CreateDiaData) => Promise<boolean>;
  isCreatingDia: boolean;
  createDiaResponse: { ok: boolean; message: string };
  clearCreateDiaResponse: () => void;

  // UPDATE DÍA
  updateDia: (id: number, data: UpdateDiaData) => Promise<boolean>;
  isUpdatingDia: boolean;
  updateDiaResponse: { ok: boolean; message: string };
  clearUpdateDiaResponse: () => void;

  // DELETE DÍA
  deleteDia: (id: number) => Promise<boolean>;
  isDeletingDia: boolean;
  deleteDiaResponse: { ok: boolean; message: string };
  clearDeleteDiaResponse: () => void;

  // ACCIONES GENERALES DE DÍAS
  fetchDias: (force?: boolean) => Promise<void>;
  selectDia: (id: number) => void;
  clearSelectedDia: () => void;
  clearDias: () => void;

  // ========== ESTADO DE BLOQUES HORARIOS ==========
  bloquesHorarios: BloqueHorario[];
  selectedBloqueHorario: BloqueHorario | null;
  hasLoadedBloquesHorarios: boolean;
  isLoadingBloquesHorarios: boolean;
  bloquesHorariosResponse: { ok: boolean; message: string };

  // CREATE BLOQUE HORARIO
  createBloqueHorario: (data: CreateBloqueHorarioData) => Promise<boolean>;
  isCreatingBloqueHorario: boolean;
  createBloqueHorarioResponse: { ok: boolean; message: string };
  clearCreateBloqueHorarioResponse: () => void;

  // UPDATE BLOQUE HORARIO
  updateBloqueHorario: (id: number, data: UpdateBloqueHorarioData) => Promise<boolean>;
  isUpdatingBloqueHorario: boolean;
  updateBloqueHorarioResponse: { ok: boolean; message: string };
  clearUpdateBloqueHorarioResponse: () => void;

  // DELETE BLOQUE HORARIO
  deleteBloqueHorario: (id: number) => Promise<boolean>;
  isDeletingBloqueHorario: boolean;
  deleteBloqueHorarioResponse: { ok: boolean; message: string };
  clearDeleteBloqueHorarioResponse: () => void;

  // ACCIONES GENERALES DE BLOQUES HORARIOS
  fetchBloquesHorarios: (force?: boolean) => Promise<void>;
  selectBloqueHorario: (id: number) => void;
  clearSelectedBloqueHorario: () => void;
  clearBloquesHorarios: () => void;
};

export const createHorarioSlice: StateCreator<HorarioSliceType> = (set, get) => ({
  // ========== ESTADO INICIAL DE DÍAS ==========
  dias: [],
  selectedDia: null,
  hasLoadedDias: false,
  isLoadingDias: false,
  diasResponse: initialResponse,

  isCreatingDia: false,
  createDiaResponse: initialResponse,

  isUpdatingDia: false,
  updateDiaResponse: initialResponse,

  isDeletingDia: false,
  deleteDiaResponse: initialResponse,

  // ========== ESTADO INICIAL DE BLOQUES HORARIOS ==========
  bloquesHorarios: [],
  selectedBloqueHorario: null,
  hasLoadedBloquesHorarios: false,
  isLoadingBloquesHorarios: false,
  bloquesHorariosResponse: initialResponse,

  isCreatingBloqueHorario: false,
  createBloqueHorarioResponse: initialResponse,

  isUpdatingBloqueHorario: false,
  updateBloqueHorarioResponse: initialResponse,

  isDeletingBloqueHorario: false,
  deleteBloqueHorarioResponse: initialResponse,

  // ========== FUNCIONES DE DÍAS ==========
  fetchDias: async (force = false) => {
    const { hasLoadedDias } = get();
    if (hasLoadedDias && !force) return;

    set({ isLoadingDias: true });

    try {
      const response = await getAllDias();

      if (!response) {
        set({
          isLoadingDias: false,
          diasResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        set({
          dias: response.data,
          hasLoadedDias: true,
          diasResponse: { ok: true, message: response.message },
          isLoadingDias: false,
        });
      } else {
        set({
          diasResponse: {
            ok: false,
            message: response.message || "Error al obtener días",
          },
          isLoadingDias: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchDias:", error);
      set({
        diasResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingDias: false,
      });
    }
  },

  createDia: async (data) => {
    set({
      isCreatingDia: true,
      createDiaResponse: initialResponse,
    });

    try {
      const response = await createDia(data);

      if (!response) {
        set({
          createDiaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isCreatingDia: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          dias: [...state.dias, response.data!],
          createDiaResponse: {
            ok: true,
            message: response.message,
          },
          isCreatingDia: false,
        }));

        return true;
      }

      set({
        createDiaResponse: {
          ok: false,
          message: response.message || "Error al crear el día",
        },
        isCreatingDia: false,
      });
      return false;
    } catch (error) {
      console.error("Error en createDia:", error);
      set({
        createDiaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingDia: false,
      });
      return false;
    }
  },

  updateDia: async (id, data) => {
    set({
      isUpdatingDia: true,
      updateDiaResponse: initialResponse,
    });

    try {
      const response = await updateDia(id, data);

      if (!response) {
        set({
          updateDiaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingDia: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          dias: state.dias.map((dia) =>
            dia.id_dia === id ? response.data! : dia
          ),
          selectedDia:
            state.selectedDia?.id_dia === id
              ? response.data
              : state.selectedDia,
          updateDiaResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingDia: false,
        }));

        return true;
      }

      set({
        updateDiaResponse: {
          ok: false,
          message: response.message || "Error al actualizar el día",
        },
        isUpdatingDia: false,
      });
      return false;
    } catch (error) {
      console.error("Error en updateDia:", error);
      set({
        updateDiaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingDia: false,
      });
      return false;
    }
  },

  deleteDia: async (id) => {
    set({
      isDeletingDia: true,
      deleteDiaResponse: initialResponse,
    });

    try {
      const response = await deleteDia(id);

      if (!response) {
        set({
          deleteDiaResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isDeletingDia: false,
        });
        return false;
      }

      if (response.ok) {
        set((state) => ({
          dias: state.dias.filter((dia) => dia.id_dia !== id),
          deleteDiaResponse: {
            ok: true,
            message: response.message,
          },
          isDeletingDia: false,
        }));

        setTimeout(() => {
          const { selectedDia } = get();
          if (selectedDia?.id_dia === id) {
            set({ selectedDia: null });
          }
        }, 300);

        return true;
      }

      set({
        deleteDiaResponse: {
          ok: false,
          message: response.message || "Error al eliminar el día",
        },
        isDeletingDia: false,
      });
      return false;
    } catch (error) {
      console.error("Error en deleteDia:", error);
      set({
        deleteDiaResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingDia: false,
      });
      return false;
    }
  },

  selectDia: (id) => {
    const { dias } = get();
    const selectedDia = dias.find((dia) => dia.id_dia === id);

    if (selectedDia) {
      set({ selectedDia });
    } else {
      console.warn("Día no encontrado:", id);
    }
  },

  clearSelectedDia: () => set({ selectedDia: null }),
  clearCreateDiaResponse: () => set({ createDiaResponse: initialResponse }),
  clearUpdateDiaResponse: () => set({ updateDiaResponse: initialResponse }),
  clearDeleteDiaResponse: () => set({ deleteDiaResponse: initialResponse }),
  clearDias: () =>
    set({
      dias: [],
      hasLoadedDias: false,
      diasResponse: initialResponse,
    }),

  // ========== FUNCIONES DE BLOQUES HORARIOS ==========
  fetchBloquesHorarios: async (force = false) => {
    const { hasLoadedBloquesHorarios } = get();
    if (hasLoadedBloquesHorarios && !force) return;

    set({ isLoadingBloquesHorarios: true });

    try {
      const response = await getAllBloquesHorarios();

      if (!response) {
        set({
          isLoadingBloquesHorarios: false,
          bloquesHorariosResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        set({
          bloquesHorarios: response.data,
          hasLoadedBloquesHorarios: true,
          bloquesHorariosResponse: { ok: true, message: response.message },
          isLoadingBloquesHorarios: false,
        });
      } else {
        set({
          bloquesHorariosResponse: {
            ok: false,
            message: response.message || "Error al obtener bloques horarios",
          },
          isLoadingBloquesHorarios: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchBloquesHorarios:", error);
      set({
        bloquesHorariosResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingBloquesHorarios: false,
      });
    }
  },

  createBloqueHorario: async (data) => {
    set({
      isCreatingBloqueHorario: true,
      createBloqueHorarioResponse: initialResponse,
    });

    try {
      const response = await createBloqueHorario(data);

      if (!response) {
        set({
          createBloqueHorarioResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isCreatingBloqueHorario: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          bloquesHorarios: [...state.bloquesHorarios, response.data!],
          createBloqueHorarioResponse: {
            ok: true,
            message: response.message,
          },
          isCreatingBloqueHorario: false,
        }));

        return true;
      }

      set({
        createBloqueHorarioResponse: {
          ok: false,
          message: response.message || "Error al crear el bloque horario",
        },
        isCreatingBloqueHorario: false,
      });
      return false;
    } catch (error) {
      console.error("Error en createBloqueHorario:", error);
      set({
        createBloqueHorarioResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingBloqueHorario: false,
      });
      return false;
    }
  },

  updateBloqueHorario: async (id, data) => {
    set({
      isUpdatingBloqueHorario: true,
      updateBloqueHorarioResponse: initialResponse,
    });

    try {
      const response = await updateBloqueHorario(id, data);

      if (!response) {
        set({
          updateBloqueHorarioResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingBloqueHorario: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set((state) => ({
          bloquesHorarios: state.bloquesHorarios.map((bloque) =>
            bloque.id_bloque === id ? response.data! : bloque
          ),
          selectedBloqueHorario:
            state.selectedBloqueHorario?.id_bloque === id
              ? response.data
              : state.selectedBloqueHorario,
          updateBloqueHorarioResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingBloqueHorario: false,
        }));

        return true;
      }

      set({
        updateBloqueHorarioResponse: {
          ok: false,
          message: response.message || "Error al actualizar el bloque horario",
        },
        isUpdatingBloqueHorario: false,
      });
      return false;
    } catch (error) {
      console.error("Error en updateBloqueHorario:", error);
      set({
        updateBloqueHorarioResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingBloqueHorario: false,
      });
      return false;
    }
  },

  deleteBloqueHorario: async (id) => {
    set({
      isDeletingBloqueHorario: true,
      deleteBloqueHorarioResponse: initialResponse,
    });

    try {
      const response = await deleteBloqueHorario(id);

      if (!response) {
        set({
          deleteBloqueHorarioResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isDeletingBloqueHorario: false,
        });
        return false;
      }

      if (response.ok) {
        set((state) => ({
          bloquesHorarios: state.bloquesHorarios.filter(
            (bloque) => bloque.id_bloque !== id
          ),
          deleteBloqueHorarioResponse: {
            ok: true,
            message: response.message,
          },
          isDeletingBloqueHorario: false,
        }));

        setTimeout(() => {
          const { selectedBloqueHorario } = get();
          if (selectedBloqueHorario?.id_bloque === id) {
            set({ selectedBloqueHorario: null });
          }
        }, 300);

        return true;
      }

      set({
        deleteBloqueHorarioResponse: {
          ok: false,
          message: response.message || "Error al eliminar el bloque horario",
        },
        isDeletingBloqueHorario: false,
      });
      return false;
    } catch (error) {
      console.error("Error en deleteBloqueHorario:", error);
      set({
        deleteBloqueHorarioResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingBloqueHorario: false,
      });
      return false;
    }
  },

  selectBloqueHorario: (id) => {
    const { bloquesHorarios } = get();
    const selectedBloqueHorario = bloquesHorarios.find(
      (bloque) => bloque.id_bloque === id
    );

    if (selectedBloqueHorario) {
      set({ selectedBloqueHorario });
    } else {
      console.warn("Bloque horario no encontrado:", id);
    }
  },

  clearSelectedBloqueHorario: () => set({ selectedBloqueHorario: null }),
  clearCreateBloqueHorarioResponse: () =>
    set({ createBloqueHorarioResponse: initialResponse }),
  clearUpdateBloqueHorarioResponse: () =>
    set({ updateBloqueHorarioResponse: initialResponse }),
  clearDeleteBloqueHorarioResponse: () =>
    set({ deleteBloqueHorarioResponse: initialResponse }),
  clearBloquesHorarios: () =>
    set({
      bloquesHorarios: [],
      hasLoadedBloquesHorarios: false,
      bloquesHorariosResponse: initialResponse,
    }),
});