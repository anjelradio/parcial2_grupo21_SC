import axios from "axios";
import {
  LoginAPIResponseSchema,
  MeAPIResponseSchema,
  LogoutAPIResponseSchema,
  UpdateProfileResponseSchema,
} from "../utils/auth-schemas";
import type { LoginForm, UpdatePassword, UpdatePersonalInfo } from "../types";
import { API_BASE_URL } from "../config/api";

const BASE_URL = `${API_BASE_URL}/auth`;

/**
 * Get authentication headers from localStorage
 */
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

/**
 * LOGIN - Unified for code and email
 */
export async function login(credentials: LoginForm) {
  const url = `${BASE_URL}/login`;
  
  try {
    const { data } = await axios.post(url, credentials, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    const result = LoginAPIResponseSchema.safeParse(data);
    
    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "iniciar sesión");
  }
}

/**
 * ME - Get authenticated user
 */
export async function me() {
  const url = `${BASE_URL}/me`;
  
  try {
    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
      validateStatus: () => true,
    });

    const result = MeAPIResponseSchema.safeParse(data);
    
    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "obtener usuario");
  }
}

/**
 * LOGOUT - Close session
 */
export async function logout() {
  const url = `${BASE_URL}/logout`;
  
  try {
    const { data } = await axios.post(
      url,
      {},
      {
        headers: getAuthHeaders(),
        validateStatus: () => true,
      }
    );

    const result = LogoutAPIResponseSchema.safeParse(data);
    
    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "cerrar sesión");
  }
}

/**
 * Centralized Axios error handling
 */
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

/**
 * Perfil - Update info y reset password
 */
export async function updatePersonalInfo(id: number, formData: UpdatePersonalInfo) {
  const url = `${BASE_URL}/update-personal-info/${id}`;
  try {
    const { data } = await axios.put(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = UpdateProfileResponseSchema.safeParse(data);
    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar información personal");
  }
}

export async function updatePassword(id: number, formData: UpdatePassword) {
  const url = `${BASE_URL}/update-password/${id}`;
  try {
    const { data } = await axios.put(url, formData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      validateStatus: () => true,
    });

    const result = UpdateProfileResponseSchema.safeParse(data);
    return result.success
      ? result.data
      : {
          ok: false,
          message: data?.message || "Respuesta inválida del servidor",
          data: null,
        };
  } catch (error) {
    return handleAxiosError(error, "actualizar contraseña");
  }
}