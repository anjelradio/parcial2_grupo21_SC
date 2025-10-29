import type { StateCreator } from "zustand";
import type {
  PermisoDocente,
  SolicitudAula,
  UpdatePermisoDocenteData,
  UpdateSolicitudAulaData,
} from "../../types";
import {
  getAllPermisosDocente,
  updatePermisoDocente,
  getAllSolicitudesAula,
  updateSolicitudAula,
} from "../../api/controlDocenteService";

const initialResponse = { ok: false, message: "" };

export type ControlDocenteSliceType = {
  // ============================================
  // PERMISOS DOCENTE
  // ============================================
  permisosDocente: PermisoDocente[];
  selectedPermiso: PermisoDocente | null;
  hasLoadedPermisos: boolean;
  isLoadingPermisos: boolean;
  permisosResponse: { ok: boolean; message: string };

  // UPDATE PERMISO
  updatePermiso: (id: number, data: UpdatePermisoDocenteData) => Promise<boolean>;
  isUpdatingPermiso: boolean;
  updatePermisoResponse: { ok: boolean; message: string };
  clearUpdatePermisoResponse: () => void;

  // ACCIONES PERMISO
  fetchPermisosDocente: (force?: boolean) => Promise<void>;
  selectPermiso: (id: number) => void;
  clearSelectedPermiso: () => void;
  clearPermisosDocente: () => void;

  // ============================================
  // SOLICITUDES AULA
  // ============================================
  solicitudesAula: SolicitudAula[];
  selectedSolicitud: SolicitudAula | null;
  hasLoadedSolicitudes: boolean;
  isLoadingSolicitudes: boolean;
  solicitudesResponse: { ok: boolean; message: string };

  // UPDATE SOLICITUD
  updateSolicitud: (id: number, data: UpdateSolicitudAulaData) => Promise<boolean>;
  isUpdatingSolicitud: boolean;
  updateSolicitudResponse: { ok: boolean; message: string };
  clearUpdateSolicitudResponse: () => void;

  // ACCIONES SOLICITUD
  fetchSolicitudesAula: (force?: boolean) => Promise<void>;
  selectSolicitud: (id: number) => void;
  clearSelectedSolicitud: () => void;
  clearSolicitudesAula: () => void;
};

export const createControlDocenteSlice: StateCreator<
  ControlDocenteSliceType
> = (set, get) => ({
  // ============================================
  // ESTADO INICIAL - PERMISOS
  // ============================================
  permisosDocente: [],
  selectedPermiso: null,
  hasLoadedPermisos: false,
  isLoadingPermisos: false,
  permisosResponse: initialResponse,

  isUpdatingPermiso: false,
  updatePermisoResponse: initialResponse,

  // ============================================
  // ESTADO INICIAL - SOLICITUDES
  // ============================================
  solicitudesAula: [],
  selectedSolicitud: null,
  hasLoadedSolicitudes: false,
  isLoadingSolicitudes: false,
  solicitudesResponse: initialResponse,

  isUpdatingSolicitud: false,
  updateSolicitudResponse: initialResponse,

  // ============================================
  // PERMISOS DOCENTE - IMPLEMENTACIÓN
  // ============================================

  fetchPermisosDocente: async (force = false) => {
    const { hasLoadedPermisos } = get();
    if (hasLoadedPermisos && !force) {
      console.log("Permisos ya cargados, saltando fetch");
      return;
    }

    console.log("Iniciando fetchPermisosDocente...");
    set({ isLoadingPermisos: true });

    const response = await getAllPermisosDocente();
    console.log("Respuesta de getAllPermisosDocente:", response);

    if (response.ok && response.data) {
      console.log("Permisos cargados exitosamente:", response.data.length);
      set({
        permisosDocente: response.data,
        hasLoadedPermisos: true,
        permisosResponse: { ok: true, message: response.message },
        isLoadingPermisos: false,
      });
    } else {
      console.error("Error en respuesta:", response.message);
      set({
        permisosResponse: {
          ok: false,
          message: response.message || "Error al obtener permisos",
        },
        isLoadingPermisos: false,
      });
    }
  },

  updatePermiso: async (id, data) => {
    set({
      isUpdatingPermiso: true,
      updatePermisoResponse: initialResponse,
    });

    try {
      const response = await updatePermisoDocente(id, data);
      console.log("Respuesta updatePermiso:", response);

      if (!response) {
        set({
          updatePermisoResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingPermiso: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        const updatedPermiso = response.data;

        set((state) => ({
          permisosDocente: state.permisosDocente.map((permiso) =>
            permiso.id_permiso === id ? updatedPermiso : permiso
          ),
          selectedPermiso:
            state.selectedPermiso?.id_permiso === id
              ? updatedPermiso
              : state.selectedPermiso,
          updatePermisoResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingPermiso: false,
        }));

        return true;
      }

      set({
        updatePermisoResponse: {
          ok: false,
          message: response.message || "Error al actualizar el permiso",
        },
        isUpdatingPermiso: false,
      });
      return false;
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

  clearSelectedPermiso: () => set({ selectedPermiso: null }),
  clearUpdatePermisoResponse: () =>
    set({ updatePermisoResponse: initialResponse }),
  clearPermisosDocente: () =>
    set({
      permisosDocente: [],
      hasLoadedPermisos: false,
      permisosResponse: initialResponse,
    }),

  // ============================================
  // SOLICITUDES AULA - IMPLEMENTACIÓN
  // ============================================

  fetchSolicitudesAula: async (force = false) => {
    const { hasLoadedSolicitudes } = get();
    if (hasLoadedSolicitudes && !force) {
      console.log("Solicitudes ya cargadas, saltando fetch");
      return;
    }

    console.log("Iniciando fetchSolicitudesAula...");
    set({ isLoadingSolicitudes: true });

    try {
      const response = await getAllSolicitudesAula();
      console.log("Respuesta de getAllSolicitudesAula:", response);

      if (!response) {
        console.error("No se recibió respuesta del servidor");
        set({
          isLoadingSolicitudes: false,
          solicitudesResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        console.log("Solicitudes cargadas exitosamente:", response.data.length);
        set({
          solicitudesAula: response.data,
          hasLoadedSolicitudes: true,
          solicitudesResponse: { ok: true, message: response.message },
          isLoadingSolicitudes: false,
        });
      } else {
        console.error("Error en respuesta:", response.message);
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

  updateSolicitud: async (id, data) => {
    set({
      isUpdatingSolicitud: true,
      updateSolicitudResponse: initialResponse,
    });

    try {
      const response = await updateSolicitudAula(id, data);
      console.log("Respuesta updateSolicitud:", response);

      if (!response) {
        set({
          updateSolicitudResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingSolicitud: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        const updatedSolicitud = response.data;

        set((state) => ({
          solicitudesAula: state.solicitudesAula.map((solicitud) =>
            solicitud.id_solicitud === id ? updatedSolicitud : solicitud
          ),
          selectedSolicitud:
            state.selectedSolicitud?.id_solicitud === id
              ? updatedSolicitud
              : state.selectedSolicitud,
          updateSolicitudResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingSolicitud: false,
        }));

        return true;
      }

      set({
        updateSolicitudResponse: {
          ok: false,
          message: response.message || "Error al actualizar la solicitud",
        },
        isUpdatingSolicitud: false,
      });
      return false;
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
    const { solicitudesAula } = get();
    const selectedSolicitud = solicitudesAula.find(
      (s) => s.id_solicitud === id
    );

    if (selectedSolicitud) {
      set({ selectedSolicitud });
    } else {
      console.warn("Solicitud no encontrada:", id);
    }
  },

  clearSelectedSolicitud: () => set({ selectedSolicitud: null }),
  clearUpdateSolicitudResponse: () =>
    set({ updateSolicitudResponse: initialResponse }),
  clearSolicitudesAula: () =>
    set({
      solicitudesAula: [],
      hasLoadedSolicitudes: false,
      solicitudesResponse: initialResponse,
    }),
});