import axios from "axios";
import {
  AsignacionesListResponseSchema,
  AsignacionMutationResponseSchema,
  ConflictosResponseSchema,
} from "../utils/asignacion-schemas";

import type {
  AsignacionesListResponse,
  CreateAsignacionData,
  UpdateAsignacionData,
} from "../types";

import { API_BASE_URL } from "../config/api";

// ============================================
// AUTH HEADERS
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

// ============================================
// ERROR HANDLER GENÉRICO
// ============================================
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
// BASE URL
// ============================================
const BASE_URL = `${API_BASE_URL}/asignaciones`;

// ============================================
// GET LIST + PAGINACIÓN + FILTROS
// ============================================
export async function getAllAsignaciones(params?: {
  page?: number;
  page_size?: number;
  nombre_docente?: string;
  id_gestion?: number;
  semestre?: number;
}): Promise<AsignacionesListResponse> {
  try {
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.page_size) query.append("page_size", String(params.page_size));
    if (params?.nombre_docente)
      query.append("nombre_docente", params.nombre_docente);
    if (params?.id_gestion)
      query.append("id_gestion", String(params.id_gestion));
    if (params?.semestre) query.append("semestre", String(params.semestre));

    const qs = query.toString();
    const url = qs ? `${BASE_URL}?${qs}` : BASE_URL;

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = AsignacionesListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError<AsignacionesListResponse["data"]>(
      error,
      "obtener asignaciones",
      null
    );
  }
}

// ============================================
// CREATE
// ============================================
export async function createAsignacion(formData: CreateAsignacionData) {
  const url = `${BASE_URL}/create`;

  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    // Conflictos
    if (data.ok === false && data.data?.conflictos) {
      const conflictosResult = ConflictosResponseSchema.safeParse(data);
      if (conflictosResult.success) {
        return conflictosResult.data;
      }
    }

    const result = AsignacionMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "crear asignación", null);
  }
}

// ============================================
// UPDATE
// ============================================
export async function updateAsignacion(
  id: number,
  formData: UpdateAsignacionData
) {
  const url = `${BASE_URL}/update/${id}`;

  try {
    const { data } = await axios.put(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    if (data.ok === false && data.data?.conflictos) {
      const conflictosResult = ConflictosResponseSchema.safeParse(data);
      if (conflictosResult.success) return conflictosResult.data;
    }

    const result = AsignacionMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar asignación", null);
  }
}

// ============================================
// DELETE
// ============================================
export async function deleteAsignacion(id: number) {
  const url = `${BASE_URL}/delete/${id}`;

  try {
    const { data } = await axios.delete(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = AsignacionMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "eliminar asignación", null);
  }
}
