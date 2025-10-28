import axios from "axios";
import {
  UsersListResponseSchema,
  UserMutationResponseSchema,
} from "../utils/user-schemas";
import type { CreateUserData, UpdateUserData } from "../types";
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

const BASE_URL = `${API_BASE_URL}/users`;

// GET ALL
export async function getAllUsers() {
  try {
    const { data } = await axios.get(BASE_URL, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = UsersListResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener usuarios");
  }
}

// CREATE
export async function createUser(formData: CreateUserData) {
  const url = `${BASE_URL}/create`;

  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = UserMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "crear usuario");
  }
}

// UPDATE
export async function updateUser(id: number, formData: UpdateUserData) {
  const url = `${BASE_URL}/update/${id}`;

  try {
    const { data } = await axios.put(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = UserMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar usuario");
  }
}

// DELETE
export async function deleteUser(id: number) {
  const url = `${BASE_URL}/delete/${id}`;

  try {
    const { data } = await axios.delete(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = UserMutationResponseSchema.safeParse(data);

    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "eliminar usuario");
  }
}