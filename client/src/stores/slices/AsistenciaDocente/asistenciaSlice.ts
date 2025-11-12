import type { StateCreator } from "zustand";

import {
  registrarAsistenciaPresencial,
  registrarAsistenciaVirtual,
} from "../../../api/asistenciaService";
import type { AsistenciaDocente, EvidenciaAsistencia, RegistrarAsistenciaPresencial, RegistrarAsistenciaVirtual } from "../../../types";

const initialResponse = { ok: false, message: "" };

export type AsistenciaSliceType = {
  // ============================================
  // ASISTENCIA PRESENCIAL
  // ============================================
  isLoadingPresencial: boolean;
  asistenciaPresencialResponse: { ok: boolean; message: string };
  ultimaAsistenciaPresencial: AsistenciaDocente | null;

  registrarPresencial: (
    codigo_docente: string,
    data: RegistrarAsistenciaPresencial
  ) => Promise<boolean>;
  clearAsistenciaPresencial: () => void;

  // ============================================
  // ASISTENCIA VIRTUAL
  // ============================================
  isLoadingVirtual: boolean;
  asistenciaVirtualResponse: { ok: boolean; message: string };
  ultimaAsistenciaVirtual: AsistenciaDocente | null;
  ultimaEvidencia: EvidenciaAsistencia | null;

  registrarVirtual: (
    id: number,
    data: RegistrarAsistenciaVirtual | FormData
  ) => Promise<boolean>;
  clearAsistenciaVirtual: () => void;
};

export const createAsistenciaSlice: StateCreator<AsistenciaSliceType> = (
  set
) => ({
  // ==========================
  // ESTADO INICIAL
  // ==========================
  isLoadingPresencial: false,
  asistenciaPresencialResponse: initialResponse,
  ultimaAsistenciaPresencial: null,

  isLoadingVirtual: false,
  asistenciaVirtualResponse: initialResponse,
  ultimaAsistenciaVirtual: null,
  ultimaEvidencia: null,

  // ==========================
  // REGISTRAR PRESENCIAL
  // ==========================
  registrarPresencial: async (codigo_docente, data) => {
    set({
      isLoadingPresencial: true,
      asistenciaPresencialResponse: initialResponse,
    });

    try {
      const response = await registrarAsistenciaPresencial(codigo_docente, data);
      console.log("Respuesta registrarPresencial:", response);

      if (response.ok && response.data) {
        set({
          asistenciaPresencialResponse: {
            ok: true,
            message: response.message,
          },
          ultimaAsistenciaPresencial: response.data.asistencia,
          isLoadingPresencial: false,
        });
        return true;
      } else {
        set({
          asistenciaPresencialResponse: {
            ok: false,
            message:
              response.message ||
              "Error al registrar asistencia presencial",
          },
          isLoadingPresencial: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Error en registrarPresencial:", error);
      set({
        asistenciaPresencialResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingPresencial: false,
      });
      return false;
    }
  },

  clearAsistenciaPresencial: () =>
    set({
      isLoadingPresencial: false,
      asistenciaPresencialResponse: initialResponse,
      ultimaAsistenciaPresencial: null,
    }),

  // ==========================
  // REGISTRAR VIRTUAL
  // ==========================
  registrarVirtual: async (id: number, data: FormData | RegistrarAsistenciaVirtual) => {
    console.log(id, data)
    set({
      isLoadingVirtual: true,
      asistenciaVirtualResponse: initialResponse,
    });

    try {
      const response = await registrarAsistenciaVirtual(id, data);
      console.log("Respuesta registrarVirtual:", response);

      if (response.ok && response.data) {
        set({
          asistenciaVirtualResponse: {
            ok: true,
            message: response.message,
          },
          ultimaAsistenciaVirtual: response.data.asistencia,
          ultimaEvidencia: response.data.evidencia,
          isLoadingVirtual: false,
        });
        return true;
      } else {
        set({
          asistenciaVirtualResponse: {
            ok: false,
            message:
              response.message || "Error al registrar asistencia virtual",
          },
          isLoadingVirtual: false,
        });
        return false;
      }
    } catch (error) {
      console.error("Error en registrarVirtual:", error);
      set({
        asistenciaVirtualResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingVirtual: false,
      });
      return false;
    }
  },

  clearAsistenciaVirtual: () =>
    set({
      isLoadingVirtual: false,
      asistenciaVirtualResponse: initialResponse,
      ultimaAsistenciaVirtual: null,
      ultimaEvidencia: null,
    }),
});
