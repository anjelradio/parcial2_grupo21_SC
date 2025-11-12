import axios from "axios";
import {
  PermisosDocenteListResponseSchema,
  PermisoDocenteMutationResponseSchema,
  SolicitudesAulaListResponseSchema,
  SolicitudAulaMutationResponseSchema,
} from "../utils/controldocente-schemas";
import type {
  UpdatePermisoDocenteData,
  UpdateSolicitudAulaData,
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
// PERMISOS DOCENTE
// ============================================

const PERMISOS_BASE_URL = `${API_BASE_URL}/permisos-docente`;

/**
 * Obtener todos los permisos de docentes
 */
// ============================================
// PERMISOS DOCENTE
// ============================================

/**
 * Obtener permisos de docentes con paginación y filtros
 */
export async function getAllPermisosDocente(params?: {
  page?: number;
  page_size?: number;
  nombre_docente?: string;
  fecha?: string;
  id_gestion?: number | string;
}) {
  try {
    // Crear query string dinámico
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.page_size) query.append("page_size", String(params.page_size));
    if (params?.nombre_docente)
      query.append("nombre_docente", params.nombre_docente);
    if (params?.fecha) query.append("fecha", params.fecha);
    if (params?.id_gestion)
      query.append("id_gestion", String(params.id_gestion));

    const url =
      query.toString().length > 0
        ? `${PERMISOS_BASE_URL}?${query.toString()}`
        : PERMISOS_BASE_URL;

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    // Validar estructura con Zod
    const result = PermisosDocenteListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener permisos de docentes");
  }
}


/**
 * Actualizar estado y observaciones de un permiso
 */
export async function updatePermisoDocente(
  id: number,
  formData: UpdatePermisoDocenteData
) {
  const url = `${PERMISOS_BASE_URL}/update/${id}`;

  try {
    const { data } = await axios.put(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = PermisoDocenteMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar permiso de docente");
  }
}

// ============================================
// SOLICITUDES AULA
// ============================================

const SOLICITUDES_BASE_URL = `${API_BASE_URL}/solicitudes-aula`;

/**
 * Obtener solicitudes de aula con paginación y filtros
 */
export async function getAllSolicitudesAula(params?: {
  page?: number;
  page_size?: number;
  nombre_docente?: string;
  fecha?: string;
  id_gestion?: number | string;
}) {
  try {
    // Construir query string dinámico
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.page_size) query.append("page_size", String(params.page_size));
    if (params?.nombre_docente)
      query.append("nombre_docente", params.nombre_docente);
    if (params?.fecha) query.append("fecha", params.fecha);
    if (params?.id_gestion)
      query.append("id_gestion", String(params.id_gestion));

    const url =
      query.toString().length > 0
        ? `${SOLICITUDES_BASE_URL}?${query.toString()}`
        : SOLICITUDES_BASE_URL;

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    // Validar estructura con Zod (paginada)
    const result = SolicitudesAulaListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener solicitudes de aula");
  }
}

/**
 * Actualizar estado y observaciones de una solicitud de aula
 */
export async function updateSolicitudAula(
  id: number,
  formData: UpdateSolicitudAulaData
) {
  const url = `${SOLICITUDES_BASE_URL}/update/${id}`;

  try {
    const { data } = await axios.put(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = SolicitudAulaMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar solicitud de aula");
  }
}
