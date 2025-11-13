import axios from "axios";
import {
  EstadisticasGlobalesResponseSchema,
  EstadisticasPorAsignacionResponseSchema,
} from "../utils/supervision-schemas";

import { API_BASE_URL } from "../config/api";
import type { EstadisticasAsignacionResponse, EstadisticasGlobalesResponse } from "../types";

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

const BASE_URL = `${API_BASE_URL}/supervision-asistencias`;

// ===============================
// 1️⃣ Obtener estadísticas globales
// GET /supervision-asistencias/estadisticas/:id_gestion?
// ===============================
export async function getEstadisticasGlobales(
  id_gestion?: number
): Promise<EstadisticasGlobalesResponse> {
  const url = id_gestion
    ? `${BASE_URL}/estadisticas/${id_gestion}`
    : `${BASE_URL}/estadisticas`;

  const { data } = await axios.get(url, {
    headers: getAuthHeaders(),
    validateStatus: () => true,
  });

  const result = EstadisticasGlobalesResponseSchema.safeParse(data);

  return result.success
    ? result.data
    : {
        ok: false,
        message: data?.message || "Respuesta inválida del servidor",
        data: null,
      } as any;
}

// ===============================
// 2️⃣ Obtener estadísticas POR ASIGNACIÓN
// GET /supervision-asistencias/asignacion/:id_asignacion
// ===============================
export async function getEstadisticasPorAsignacion(
  id_asignacion: number
): Promise<EstadisticasAsignacionResponse> {
  const url = `${BASE_URL}/asignacion/${id_asignacion}`;

  const { data } = await axios.get(url, {
    headers: getAuthHeaders(),
    validateStatus: () => true,
  });

  const result = EstadisticasPorAsignacionResponseSchema.safeParse(data);

  return result.success
    ? result.data
    : {
        ok: false,
        message: data?.message || "Respuesta inválida del servidor",
        data: null,
      } as any;
}
