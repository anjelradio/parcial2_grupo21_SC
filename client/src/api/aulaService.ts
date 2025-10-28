import axios from "axios";
import {
  AulasListResponseSchema,
  AulaMutationResponseSchema,
} from "../utils/aula-schemas";
import type { CreateAulaData, UpdateAulaData } from "../types";
import { API_BASE_URL } from "../config/api";

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

const BASE_URL = `${API_BASE_URL}/aulas`;

// GET ALL
export async function getAllAulas() {
  try {
    const { data } = await axios.get(BASE_URL, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = AulasListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener aulas");
  }
}

// CREATE
export async function createAula(formData: CreateAulaData) {
  const url = `${BASE_URL}/create`;

  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = AulaMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "crear aula");
  }
}

// UPDATE
export async function updateAula(nroAula: string, formData: UpdateAulaData) {
  const url = `${BASE_URL}/update/${nroAula}`;

  try {
    const { data } = await axios.put(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = AulaMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar aula");
  }
}

// DELETE
export async function deleteAula(nroAula: string) {
  const url = `${BASE_URL}/delete/${nroAula}`;

  try {
    const { data } = await axios.delete(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = AulaMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "eliminar aula");
  }
}