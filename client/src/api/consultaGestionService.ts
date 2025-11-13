import axios from "axios";
import {
  DocentesListPagResponseSchema,
  EstadisticasGestionResponseSchema,
  GruposListPagResponseSchema,
  ListaSemestresResponseSchema,
} from "../utils/consulta-gestion-schemas";
import type {
  DocentesListPagResponse,
  EstadisticasGestionResponse,
  GruposListPagResponse,
  ListaSemestresResponse,
} from "../types";
import { API_BASE_URL } from "../config/api";

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

function handleAxiosError<T>(
  error: unknown,
  action: string,
  defaultData: T
): { ok: false; message: string; data: T } {
  console.error(`Error al ${action}:`, error);

  if (axios.isAxiosError(error)) {
    return {
      ok: false,
      message:
        error.response?.data?.message ||
        `Error de conexión con el servidor al ${action}`,
      data: defaultData,
    };
  }

  return {
    ok: false,
    message: `Error inesperado al ${action}`,
    data: defaultData,
  };
}

// ============================================
// CONSULTA GESTIÓN - SEMESTRES
// ============================================

const CONSULTA_GESTION_BASE_URL = `${API_BASE_URL}/consulta-gestion`;

/**
 * Obtener lista de semestres disponibles
 */
export async function getSemestres(): Promise<ListaSemestresResponse> {
  try {
    const url = `${CONSULTA_GESTION_BASE_URL}/semestres`;
    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = ListaSemestresResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: [],
        };
  } catch (error) {
    return handleAxiosError<ListaSemestresResponse["data"]>(
      error,
      "obtener semestres",
      []
    );
  }
}

// ============================================
// ESTADÍSTICAS DE GESTIÓN
// ============================================

export async function getEstadisticasGestion(
  id_gestion: number
): Promise<EstadisticasGestionResponse> {
  try {
    const url = `${API_BASE_URL}/consulta-gestion/${id_gestion}/estadisticas`;

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = EstadisticasGestionResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError<EstadisticasGestionResponse["data"]>(
      error,
      "obtener estadísticas",
      null
    );
  }
}

// ============================================
// DOCENTES: lista paginada con filtros
// ============================================

export async function getDocentesGestion(
  id_gestion: number,
  params?: {
    page?: number;
    page_size?: number;
    nombre_docente?: string;
  }
): Promise<DocentesListPagResponse> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.page_size) query.append("page_size", String(params.page_size));
    if (params?.nombre_docente)
      query.append("nombre_docente", params.nombre_docente);

    const qs = query.toString();
    const url = `${CONSULTA_GESTION_BASE_URL}/${id_gestion}/docentes${
      qs ? `?${qs}` : ""
    }`;
    console.log(url)

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = DocentesListPagResponseSchema.safeParse(data);
    console.log(result)
    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError<DocentesListPagResponse["data"]>(
      error,
      "obtener docentes activos",
      null
    );
  }
}
// ============================================
// GRUPOS/MATERIAS: lista paginada con filtros
// ============================================

export async function getGruposGestion(
  id_gestion: number,
  params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }
): Promise<GruposListPagResponse> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.page_size) query.append("page_size", String(params.page_size));
    if (params?.search) query.append("search", params.search);

    const qs = query.toString();
    const url = `${CONSULTA_GESTION_BASE_URL}/${id_gestion}/grupos${
      qs ? `?${qs}` : ""
    }`;

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = GruposListPagResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError<GruposListPagResponse["data"]>(
      error,
      "obtener grupos/materias activos",
      null
    );
  }
}
