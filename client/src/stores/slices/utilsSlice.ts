import type { StateCreator } from "zustand";
import { getAllDocentes, getAllSemestres, getAsignacionesPorDocente } from "../../api/utilsService";
import type { AsignacionDocente, Docente, Semestre } from "../../types";

const initialResponse = { ok: false, message: "" };

export type UtilsSliceType = {
  // ============================================
  // SEMESTRES (GESTIONES ACADÉMICAS)
  // ============================================
  semestres: Semestre[];
  isLoadingSemestres: boolean;
  hasLoadedSemestres: boolean;
  semestresResponse: { ok: boolean; message: string };

  fetchSemestres: (force?: boolean) => Promise<void>;
  clearSemestres: () => void;

  // ============================================
  // DOCENTES (UTILIDAD GLOBAL)
  // ============================================
  docentes: Docente[];
  isLoadingDocentes: boolean;
  hasLoadedDocentes: boolean;
  docentesResponse: { ok: boolean; message: string };

  fetchDocentes: (force?: boolean) => Promise<void>;
  clearDocentes: () => void;

  // ============================================
  // ASIGNACIONES POR DOCENTE
  // ============================================
  asignacionesDocente: AsignacionDocente[];
  gestionAsignacionesActual: string | null;
  isLoadingAsignacionesDocente: boolean;
  hasLoadedAsignacionesDocente: boolean;
  asignacionesDocenteResponse: { ok: boolean; message: string };

  fetchAsignacionesPorDocente: (codigo_docente: string, force?: boolean) => Promise<void>;
  clearAsignacionesPorDocente: () => void;

};

export const createUtilsSlice: StateCreator<UtilsSliceType> = (set, get) => ({
  // ============================================
  // ESTADO INICIAL
  // ============================================
  semestres: [],
  isLoadingSemestres: false,
  hasLoadedSemestres: false,
  semestresResponse: initialResponse,

  // ============================================
  // ESTADO INICIAL - DOCENTES
  // ============================================
  docentes: [],
  isLoadingDocentes: false,
  hasLoadedDocentes: false,
  docentesResponse: initialResponse,

  // ============================================
  // ESTADO INICIAL - ASIGNACIONES POR DOCENTE
  // ============================================
  asignacionesDocente: [],
  gestionAsignacionesActual: null,
  isLoadingAsignacionesDocente: false,
  hasLoadedAsignacionesDocente: false,
  asignacionesDocenteResponse: initialResponse,

  // ============================================
  // ACCIONES
  // ============================================

  fetchSemestres: async (force = false) => {
    const { hasLoadedSemestres } = get();
    if (hasLoadedSemestres && !force) {
      console.log("Semestres ya cargados, saltando fetch");
      return;
    }

    console.log("Iniciando fetchSemestres...");
    set({ isLoadingSemestres: true });

    try {
      const response = await getAllSemestres();
      console.log("Respuesta de getAllSemestres:", response);

      if (response.ok && response.data?.semestres) {
        set({
          semestres: response.data.semestres,
          hasLoadedSemestres: true,
          semestresResponse: { ok: true, message: response.message },
          isLoadingSemestres: false,
        });
      } else {
        set({
          semestresResponse: {
            ok: false,
            message: response.message || "Error al obtener semestres",
          },
          isLoadingSemestres: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchSemestres:", error);
      set({
        semestresResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingSemestres: false,
      });
    }
  },

  clearSemestres: () =>
    set({
      semestres: [],
      hasLoadedSemestres: false,
      semestresResponse: initialResponse,
    }),

  // ============================================
  // ACCIÓN - FETCH DOCENTES
  // ============================================
  fetchDocentes: async (force = false) => {
    const { hasLoadedDocentes } = get();
    if (hasLoadedDocentes && !force) {
      console.log("Docentes ya cargados, saltando fetch");
      return;
    }

    console.log("Iniciando fetchDocentes...");
    set({ isLoadingDocentes: true });

    try {
      const response = await getAllDocentes();
      console.log("Respuesta de getAllDocentes:", response);

      if (response.ok && response.data?.docentes) {
        set({
          docentes: response.data.docentes,
          hasLoadedDocentes: true,
          docentesResponse: { ok: true, message: response.message },
          isLoadingDocentes: false,
        });
      } else {
        set({
          docentesResponse: {
            ok: false,
            message: response.message || "Error al obtener docentes",
          },
          isLoadingDocentes: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchDocentes:", error);
      set({
        docentesResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingDocentes: false,
      });
    }
  },
  clearDocentes: () =>
    set({
      docentes: [],
      hasLoadedDocentes: false,
      docentesResponse: initialResponse,
    }),

    // ============================================
  // ACCIÓN - FETCH ASIGNACIONES POR DOCENTE
  // ============================================
  fetchAsignacionesPorDocente: async (codigo_docente, force = false) => {
    const { hasLoadedAsignacionesDocente } = get();
    if (hasLoadedAsignacionesDocente && !force) {
      console.log("Asignaciones ya cargadas, saltando fetch");
      return;
    }

    console.log(`Iniciando fetchAsignacionesPorDocente (${codigo_docente})...`);
    set({ isLoadingAsignacionesDocente: true });

    try {
      const response = await getAsignacionesPorDocente(codigo_docente);
      console.log("Respuesta de getAsignacionesPorDocente:", response);

      if (response.ok && response.data) {
        set({
          asignacionesDocente: response.data.asignaciones,
          gestionAsignacionesActual: response.data.gestion_actual,
          asignacionesDocenteResponse: { ok: true, message: response.message },
          hasLoadedAsignacionesDocente: true,
          isLoadingAsignacionesDocente: false,
        });
      } else {
        set({
          asignacionesDocenteResponse: {
            ok: false,
            message: response.message || "Error al obtener asignaciones",
          },
          isLoadingAsignacionesDocente: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchAsignacionesPorDocente:", error);
      set({
        asignacionesDocenteResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingAsignacionesDocente: false,
      });
    }
  },
  clearAsignacionesPorDocente: () =>
    set({
      asignacionesDocente: [],
      gestionAsignacionesActual: null,
      hasLoadedAsignacionesDocente: false,
      asignacionesDocenteResponse: initialResponse,
    }),
});
