import axios from "axios";
import { API_BASE_URL } from "../config/api";
import {
  ControlDocenteStatsResponseSchema,
} from "../utils/stats-schema";

// ============================================
// HELPERS
// ============================================

function getAuthHeaders() {
  const data = localStorage.getItem("app-store");
  if (!data) return {};

  try {
    const state = JSON.parse(data)?.state;
    const token = state?.tokens?.token;
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
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
// CONTROL DOCENTE - ESTADÍSTICAS GLOBALES
// ============================================

const ESTADISTICAS_BASE_URL = `${API_BASE_URL}/estadisticas`;

/**
 * Obtener estadísticas globales de Control Docente
 * (Permisos, Solicitudes de Aula y Suplencias)
 */
export async function getControlDocenteStats() {
  try {
    const url = `${ESTADISTICAS_BASE_URL}/control-docente`;

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    // Validar estructura con Zod
    const result = ControlDocenteStatsResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener estadísticas de Control Docente");
  }
}
