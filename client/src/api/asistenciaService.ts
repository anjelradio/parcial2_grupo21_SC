import axios from "axios";
import {
  AsistenciaResponseSchema,
  RegistrarAsistenciaPresencialSchema,
  RegistrarAsistenciaVirtualSchema,
} from "../utils/asistencia-schemas";

import { API_BASE_URL } from "../config/api";
import type {
  RegistrarAsistenciaPresencial,
  RegistrarAsistenciaVirtual,
} from "../types";

// ============================================
// HELPERS DE AUTENTICACIÓN Y ERRORES
// ============================================

function getAuthHeaders() {
  const data = localStorage.getItem("app-store");
  if (!data) return {};
  try {
    const state = JSON.parse(data)?.state;
    const token = state?.tokens?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function handleAxiosError(error: unknown, action: string) {
  console.error(`Error al ${action}:`, error);
  if (axios.isAxiosError(error)) {
    return {
      ok: false as const,
      message:
        error.response?.data?.message ||
        `Error de conexión con el servidor al ${action}`,
      data: null,
    };
  }
  return {
    ok: false as const,
    message: `Error inesperado al ${action}`,
    data: null,
  };
}

// ============================================
// ASISTENCIAS DOCENTE
// ============================================

/**
 * Registrar asistencia presencial (QR + GPS)
 */
export async function registrarAsistenciaPresencial(
  codigo_docente: string,
  payload: RegistrarAsistenciaPresencial
) {
  try {
    // Validar el payload antes de enviar
    RegistrarAsistenciaPresencialSchema.parse(payload);

    const url = `${API_BASE_URL}/docentes/${codigo_docente}/asistencias/presencial`;

    const { data } = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = AsistenciaResponseSchema.safeParse(data);
    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "registrar asistencia presencial");
  }
}

/**
 * Registrar asistencia virtual (IA + Screenshot)
 */
export async function registrarAsistenciaVirtual(
 id: number,
  data: FormData | RegistrarAsistenciaVirtual
) {
  try {
    // 👇 Si el usuario pasó un objeto, lo convertimos a FormData
    const formData =
      data instanceof FormData
        ? data
        : (() => {
            const fd = new FormData();
            fd.append("file", data.file);
            fd.append("motivo", data.motivo);
            fd.append("confianza", String(data.confianza));
            return fd;
          })();

    const url = `${API_BASE_URL}/docentes/${id}/asistencias/virtual`;

    const res = await axios.post(url, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
      validateStatus: () => true,
    });

    return res.data;
  } catch (error) {
    console.error("Error registrarAsistenciaVirtual:", error);
    return { ok: false, message: "Error de conexión con el servidor", data: null };
  }
}