import axios from "axios";
import {
  SuplenciasListResponseSchema,
  SuplenciaResponseSchema,
  DeleteSuplenciaResponseSchema,
} from "../utils/suplencias-schemas";
import type {
  CreateSuplenciaData,
  UpdateSuplenciaData,
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
// SUPLENCIAS DOCENTES
// ============================================

const SUPLENCIAS_BASE_URL = `${API_BASE_URL}/suplencias`;

/**
 * Obtener suplencias con paginación y filtros
 */
export async function getAllSuplencias(params?: {
  page?: number;
  page_size?: number;
  nombre_titular?: string;
  id_gestion?: number | string;
}) {
  try {
    // Construir query string dinámico
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.page_size) query.append("page_size", String(params.page_size));
    if (params?.nombre_titular)
      query.append("nombre_titular", params.nombre_titular);
    if (params?.id_gestion)
      query.append("id_gestion", String(params.id_gestion));

    const url =
      query.toString().length > 0
        ? `${SUPLENCIAS_BASE_URL}?${query.toString()}`
        : SUPLENCIAS_BASE_URL;

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    // Validar estructura con Zod
    const result = SuplenciasListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener suplencias");
  }
}

/**
 * Crear nueva suplencia
 */
export async function createSuplencia(data: CreateSuplenciaData) {
  try {
    const response = await axios.post(
      `${SUPLENCIAS_BASE_URL}/create`,
      data,
      {
        headers: getAuthHeaders(),
        validateStatus: () => true,
      }
    );

    const result = SuplenciaResponseSchema.safeParse(response.data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: response.data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "crear suplencia");
  }
}

/**
 * Actualizar suplencia existente
 */
export async function updateSuplencia(id: number, data: UpdateSuplenciaData) {
  try {
    const response = await axios.put(
      `${SUPLENCIAS_BASE_URL}/update/${id}`,
      data,
      {
        headers: getAuthHeaders(),
        validateStatus: () => true,
      }
    );

    const result = SuplenciaResponseSchema.safeParse(response.data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: response.data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar suplencia");
  }
}

/**
 * Eliminar suplencia
 */
export async function deleteSuplencia(id: number) {
  try {
    const response = await axios.delete(
      `${SUPLENCIAS_BASE_URL}/delete/${id}`,
      {
        headers: getAuthHeaders(),
        validateStatus: () => true,
      }
    );

    const result = DeleteSuplenciaResponseSchema.safeParse(response.data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: response.data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "eliminar suplencia");
  }
}