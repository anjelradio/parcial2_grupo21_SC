import type { StateCreator } from "zustand";
import type {
  FiltrosAplicados,
  Paginacion,
  PermisoDocente,
  SolicitudAula,
  UpdatePermisoDocenteData,
  UpdateSolicitudAulaData,
} from "../../../types";
import {
  getAllPermisosDocente,
  updatePermisoDocente,
  getAllSolicitudesAula,
  updateSolicitudAula,
} from "../../../api/controlDocenteService";

const initialResponse = { ok: false, message: "" };

export type ControlDocenteSliceType = {
  // ============================================
  // PERMISOS DOCENTE - RECIENTES
  // ============================================
  permisosRecientes: PermisoDocente[];
  isLoadingPermisosRecientes: boolean;
  hasLoadedPermisosRecientes: boolean;
  permisosRecientesResponse: { ok: boolean; message: string };
  fetchPermisosRecientes: (force?: boolean) => Promise<void>;
  clearPermisosRecientes: () => void;

  // ============================================
  // PERMISOS DOCENTE - LISTA PAGINADA
  // ============================================
  permisosDocente: PermisoDocente[];
  permisosPaginacion: Paginacion;
  permisosFiltros: FiltrosAplicados;
  isLoadingPermisos: boolean;
  hasLoadedPermisos: boolean;
  permisosResponse: { ok: boolean; message: string };
  fetchPermisosDocente: (params?: {
    page?: number;
    page_size?: number;
    nombre_docente?: string;
    fecha?: string;
    id_gestion?: number | string;
  }) => Promise<void>;
  clearPermisosDocente: () => void;

  // ============================================
  // SELECCIÓN Y UPDATE DE PERMISO
  // ============================================
  selectedPermiso: PermisoDocente | null;
  selectPermiso: (id: number) => void;
  clearSelectedPermiso: () => void;
  updatePermiso: (
    id: number,
    data: UpdatePermisoDocenteData
  ) => Promise<boolean>;
  isUpdatingPermiso: boolean;
  updatePermisoResponse: { ok: boolean; message: string };
  clearUpdatePermisoResponse: () => void;

  // ============================================
  // SOLICITUDES AULA - RECIENTES
  // ============================================
  solicitudesRecientes: SolicitudAula[];
  isLoadingSolicitudesRecientes: boolean;
  hasLoadedSolicitudesRecientes: boolean;
  solicitudesRecientesResponse: { ok: boolean; message: string };
  fetchSolicitudesRecientes: (force?: boolean) => Promise<void>;
  clearSolicitudesRecientes: () => void;

  // ============================================
  // SOLICITUDES AULA - LISTA PAGINADA
  // ============================================
  solicitudesAula: SolicitudAula[];
  solicitudesPaginacion: Paginacion;
  solicitudesFiltros: FiltrosAplicados;
  isLoadingSolicitudes: boolean;
  hasLoadedSolicitudes: boolean;
  solicitudesResponse: { ok: boolean; message: string };
  fetchSolicitudesAula: (params?: {
    page?: number;
    page_size?: number;
    nombre_docente?: string;
    fecha?: string;
    id_gestion?: number | string;
  }) => Promise<void>;
  clearSolicitudesAula: () => void;

  // ============================================
  // SELECCIÓN Y UPDATE DE SOLICITUD
  // ============================================
  selectedSolicitud: SolicitudAula | null;
  selectSolicitud: (id: number) => void;
  clearSelectedSolicitud: () => void;

  updateSolicitud: (
    id: number,
    data: UpdateSolicitudAulaData
  ) => Promise<boolean>;
  isUpdatingSolicitud: boolean;
  updateSolicitudResponse: { ok: boolean; message: string };
  clearUpdateSolicitudResponse: () => void;
};

export const createControlDocenteSlice: StateCreator<
  ControlDocenteSliceType
> = (set, get) => ({
  // ============================================
  // ESTADO INICIAL - PERMISOS DOCENTE
  // ============================================
  permisosRecientes: [],
  isLoadingPermisosRecientes: false,
  hasLoadedPermisosRecientes: false,
  permisosRecientesResponse: initialResponse,

  permisosDocente: [],
  permisosPaginacion: {
    total_registros: 0,
    total_paginas: 0,
    pagina_actual: 1,
    registros_por_pagina: 10,
    tiene_siguiente: false,
    tiene_anterior: false,
  },
  permisosFiltros: {
    nombre_docente: null,
    fecha: null,
    id_gestion: null,
  },

  isLoadingPermisos: false,
  permisosResponse: initialResponse,
  hasLoadedPermisos: false,

  selectedPermiso: null,
  isUpdatingPermiso: false,
  updatePermisoResponse: initialResponse,

  // ============================================
  // ESTADO INICIAL - SOLICITUDES AULA
  // ============================================
  solicitudesRecientes: [],
  isLoadingSolicitudesRecientes: false,
  hasLoadedSolicitudesRecientes: false,
  solicitudesRecientesResponse: initialResponse,

  solicitudesAula: [],
  solicitudesPaginacion: {
    total_registros: 0,
    total_paginas: 0,
    pagina_actual: 1,
    registros_por_pagina: 10,
    tiene_siguiente: false,
    tiene_anterior: false,
  },
  solicitudesFiltros: {
    nombre_docente: null,
    fecha: null,
    id_gestion: null,
  },
  hasLoadedSolicitudes: false,
  isLoadingSolicitudes: false,
  solicitudesResponse: initialResponse,

  selectedSolicitud: null,
  isUpdatingSolicitud: false,
  updateSolicitudResponse: initialResponse,

  // ============================================
  // PERMISOS DOCENTE - IMPLEMENTACIÓN
  // ============================================

  fetchPermisosRecientes: async (force = false) => {
    const { hasLoadedPermisosRecientes } = get();
    if (hasLoadedPermisosRecientes && !force) return;

    set({ isLoadingPermisosRecientes: true });

    try {
      const response = await getAllPermisosDocente({ page: 1, page_size: 5 });
      console.log("Respuesta permisos recientes:", response);

      if (response.ok && response.data) {
        set({
          permisosRecientes: response.data.permisos,
          permisosRecientesResponse: { ok: true, message: response.message },
          hasLoadedPermisosRecientes: true,
          isLoadingPermisosRecientes: false,
        });
      } else {
        set({
          permisosRecientesResponse: {
            ok: false,
            message: response.message || "Error al obtener permisos recientes",
          },
          isLoadingPermisosRecientes: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchPermisosRecientes:", error);
      set({
        permisosRecientesResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingPermisosRecientes: false,
      });
    }
  },
  fetchPermisosDocente: async (params = { page: 1, page_size: 15 }) => {
    set({ isLoadingPermisos: true });

    try {
      const response = await getAllPermisosDocente(params);
      console.log("Respuesta permisos paginados:", response);

      if (response.ok && response.data) {
        const { permisos, paginacion, filtros_aplicados } = response.data;

        set({
          permisosDocente: permisos,
          permisosPaginacion: paginacion,
          permisosFiltros: filtros_aplicados,
          permisosResponse: { ok: true, message: response.message },
          hasLoadedPermisos: true,
          isLoadingPermisos: false,
        });
      } else {
        set({
          permisosResponse: {
            ok: false,
            message: response.message || "Error al obtener permisos",
          },
          isLoadingPermisos: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchPermisosDocente:", error);
      set({
        permisosResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingPermisos: false,
      });
    }
  },

  updatePermiso: async (id, data) => {
    set({ isUpdatingPermiso: true, updatePermisoResponse: initialResponse });

    try {
      const response = await updatePermisoDocente(id, data);
      console.log("Respuesta updatePermiso:", response);

      if (!response || !response.ok || !response.data) {
        set({
          updatePermisoResponse: {
            ok: false,
            message: response?.message || "Error al actualizar el permiso",
          },
          isUpdatingPermiso: false,
        });
        return false;
      }

      const updated = response.data;

      set((state) => ({
        permisosDocente: state.permisosDocente.map((p) =>
          p.id_permiso === id ? updated : p
        ),
        permisosRecientes: state.permisosRecientes.map((p) =>
          p.id_permiso === id ? updated : p
        ),
        selectedPermiso:
          state.selectedPermiso?.id_permiso === id
            ? updated
            : state.selectedPermiso,
        updatePermisoResponse: { ok: true, message: response.message },
        isUpdatingPermiso: false,
      }));

      // === Refetch de estadísticas globales ===
      try {
        const { fetchStatsControlDocente } = get() as any;
        if (fetchStatsControlDocente) {
          await fetchStatsControlDocente(true);
        }
      } catch (err) {
        console.warn("No se pudo refrescar las estadísticas:", err);
      }

      return true;
    } catch (error) {
      console.error("Error en updatePermiso:", error);
      set({
        updatePermisoResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingPermiso: false,
      });
      return false;
    }
  },

  selectPermiso: (id) => {
    const { permisosDocente } = get();
    const selectedPermiso = permisosDocente.find((p) => p.id_permiso === id);

    if (selectedPermiso) {
      set({ selectedPermiso });
    } else {
      console.warn("Permiso no encontrado:", id);
    }
  },

  clearPermisosRecientes: () =>
    set({
      permisosRecientes: [],
      hasLoadedPermisosRecientes: false,
      permisosRecientesResponse: initialResponse,
    }),
  clearSelectedPermiso: () => set({ selectedPermiso: null }),
  clearUpdatePermisoResponse: () =>
    set({ updatePermisoResponse: initialResponse }),
  clearPermisosDocente: () =>
    set({
      permisosDocente: [],
      permisosPaginacion: {
        total_registros: 0,
        total_paginas: 0,
        pagina_actual: 1,
        registros_por_pagina: 10,
        tiene_siguiente: false,
        tiene_anterior: false,
      },
      permisosFiltros: {
        nombre_docente: null,
        fecha: null,
        id_gestion: null,
      },
      hasLoadedPermisos: false,
      permisosResponse: initialResponse,
    }),

  // ============================================
  // SOLICITUDES AULA - IMPLEMENTACIÓN
  // ============================================

  // === RECIENTES (para el dashboard) ===
  fetchSolicitudesRecientes: async (force = false) => {
    const { hasLoadedSolicitudesRecientes } = get();
    if (hasLoadedSolicitudesRecientes && !force) return;

    console.log("Iniciando fetchSolicitudesRecientes...");
    set({ isLoadingSolicitudesRecientes: true });

    try {
      const response = await getAllSolicitudesAula({
        page: 1,
        page_size: 5,
      });
      console.log("Respuesta solicitudes recientes:", response);

      if (response.ok && response.data) {
        set({
          solicitudesRecientes: response.data.solicitudes,
          solicitudesRecientesResponse: {
            ok: true,
            message: response.message,
          },
          hasLoadedSolicitudesRecientes: true,
          isLoadingSolicitudesRecientes: false,
        });
      } else {
        set({
          solicitudesRecientesResponse: {
            ok: false,
            message:
              response.message || "Error al obtener solicitudes recientes",
          },
          isLoadingSolicitudesRecientes: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchSolicitudesRecientes:", error);
      set({
        solicitudesRecientesResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingSolicitudesRecientes: false,
      });
    }
  },

  clearSolicitudesRecientes: () =>
    set({
      solicitudesRecientes: [],
      hasLoadedSolicitudesRecientes: false,
      solicitudesRecientesResponse: initialResponse,
    }),

  // === LISTA PAGINADA (para gestionar) ===
  fetchSolicitudesAula: async (params = { page: 1, page_size: 15 }) => {
    console.log("Iniciando fetchSolicitudesAula (paginado)...", params);
    set({ isLoadingSolicitudes: true });

    try {
      const response = await getAllSolicitudesAula(params);
      console.log("Respuesta solicitudes paginadas:", response);

      if (response.ok && response.data) {
        const { solicitudes, paginacion, filtros_aplicados } = response.data;

        set({
          solicitudesAula: solicitudes,
          solicitudesPaginacion: paginacion,
          solicitudesFiltros: filtros_aplicados,
          solicitudesResponse: { ok: true, message: response.message },
          hasLoadedSolicitudes: true,
          isLoadingSolicitudes: false,
        });
      } else {
        set({
          solicitudesResponse: {
            ok: false,
            message: response.message || "Error al obtener solicitudes",
          },
          isLoadingSolicitudes: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchSolicitudesAula:", error);
      set({
        solicitudesResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingSolicitudes: false,
      });
    }
  },

  clearSolicitudesAula: () =>
    set({
      solicitudesAula: [],
      solicitudesPaginacion: {
        total_registros: 0,
        total_paginas: 0,
        pagina_actual: 1,
        registros_por_pagina: 10,
        tiene_siguiente: false,
        tiene_anterior: false,
      },
      solicitudesFiltros: {
        nombre_docente: null,
        fecha: null,
        id_gestion: null,
      },
      hasLoadedSolicitudes: false,
      solicitudesResponse: initialResponse,
    }),

  // === UPDATE / SELECCIÓN ===
  updateSolicitud: async (id, data) => {
    set({
      isUpdatingSolicitud: true,
      updateSolicitudResponse: initialResponse,
    });

    try {
      const response = await updateSolicitudAula(id, data);
      console.log("Respuesta updateSolicitud:", response);

      if (!response || !response.ok || !response.data) {
        set({
          updateSolicitudResponse: {
            ok: false,
            message:
              response?.message || "Error al actualizar la solicitud de aula",
          },
          isUpdatingSolicitud: false,
        });
        return false;
      }

      const updated = response.data;

      set((state) => ({
        solicitudesAula: state.solicitudesAula.map((s) =>
          s.id_solicitud === id ? updated : s
        ),
        solicitudesRecientes: state.solicitudesRecientes.map((s) =>
          s.id_solicitud === id ? updated : s
        ),
        selectedSolicitud:
          state.selectedSolicitud?.id_solicitud === id
            ? updated
            : state.selectedSolicitud,
        updateSolicitudResponse: {
          ok: true,
          message: response.message,
        },
        isUpdatingSolicitud: false,
      }));

      try {
        const { fetchStatsControlDocente } = get() as any;
        if (fetchStatsControlDocente) {
          await fetchStatsControlDocente(true);
        }
      } catch (err) {
        console.warn("No se pudo refrescar las estadísticas:", err);
      }

      return true;
    } catch (error) {
      console.error("Error en updateSolicitud:", error);
      set({
        updateSolicitudResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingSolicitud: false,
      });
      return false;
    }
  },

  selectSolicitud: (id) => {
    const { solicitudesAula, solicitudesRecientes } = get();

    let selectedSolicitud =
      solicitudesAula.find((s) => s.id_solicitud === id) ||
      solicitudesRecientes.find((s) => s.id_solicitud === id);

    if (selectedSolicitud) {
      set({ selectedSolicitud });
    } else {
      console.warn("Solicitud no encontrada:", id);
    }
  },

  clearSelectedSolicitud: () => set({ selectedSolicitud: null }),

  clearUpdateSolicitudResponse: () =>
    set({ updateSolicitudResponse: initialResponse }),
});
