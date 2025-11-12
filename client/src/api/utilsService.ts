import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { AsignacionesPorDocenteResponseSchema, DocentesListResponseSchema, SemestresListResponseSchema } from "../utils/utils-schemas";

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
// SEMESTRES - UTILIDADES
// ============================================

const UTILIDADES_BASE_URL = `${API_BASE_URL}/utilidades`;

/**
 * Obtener todos los semestres académicos (gestiones)
 */
export async function getAllSemestres() {
  try {
    const { data } = await axios.get(`${UTILIDADES_BASE_URL}/semestres`, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = SemestresListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener lista de semestres");
  }
}

// ============================================
// DOCENTES - UTILIDADES
// ============================================

/**
 * Obtener todos los docentes (para formularios y autocompletado)
 */
export async function getAllDocentes() {
  try {
    const { data } = await axios.get(`${UTILIDADES_BASE_URL}/docentes`, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = DocentesListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener lista de docentes");
  }
}

// ============================================
// ASIGNACIONES - UTILIDADES
// ============================================

/**
 * Obtener todas las asignaciones de un docente en la gestión actual
 */
export async function getAsignacionesPorDocente(codigo_docente: string) {
  try {
    const { data } = await axios.get(
      `${UTILIDADES_BASE_URL}/asignaciones/${codigo_docente}`,
      {
        headers: getAuthHeaders(),
        validateStatus: () => true,
      }
    );

    const result = AsignacionesPorDocenteResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener asignaciones del docente");
  }
}
