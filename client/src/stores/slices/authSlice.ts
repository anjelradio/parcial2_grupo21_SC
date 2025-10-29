import type { StateCreator } from "zustand";
import type { Usuario, LoginForm, ForgotPasswordRequest } from "../../types";
import {
  login as loginAPI,
  logout as logoutAPI,
  me as meAPI,
  forgotPassword as forgotPasswordAPI,
} from "../../api/authService";

// ------ INITIAL STATE ------
const initialUser: Usuario | null = null;
const initialTokens = { token: "" };

const initialResponse = {
  ok: false,
  message: "",
};

export type AuthSliceType = {
  user: Usuario | null;
  tokens: { token: string };
  isAuthenticated: boolean;

  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isValidatingSession: boolean;
  isForgotPasswordLoading: boolean;

  loginResponse: { ok: boolean; message: string };
  logoutResponse: { ok: boolean; message: string };
  forgotPasswordResponse: { ok: boolean; message: string };

  login: (credentials: LoginForm) => Promise<boolean>;
  logout: () => Promise<boolean>;
  validateSession: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<boolean>;
  
  clearLoginResponse: () => void;
  clearLogoutResponse: () => void;
  clearForgotPasswordResponse: () => void;

  setUser: (newUserData: Partial<Usuario>) => void;
};

export const createAuthSlice: StateCreator<AuthSliceType> = (set, get) => ({
  user: initialUser,
  tokens: initialTokens,
  isAuthenticated: false,

  isLoggingIn: false,
  isLoggingOut: false,
  isValidatingSession: false,
  isForgotPasswordLoading: false,

  loginResponse: initialResponse,
  logoutResponse: initialResponse,
  forgotPasswordResponse: initialResponse,

  login: async (credentials) => {
    set({
      isLoggingIn: true,
      loginResponse: initialResponse,
    });

    try {
      const response = await loginAPI(credentials);

      if (!response) {
        set({
          loginResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isLoggingIn: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        set({
          user: response.data.user,
          tokens: { token: response.data.token },
          isAuthenticated: true,
          loginResponse: {
            ok: true,
            message: response.message,
          },
          isLoggingIn: false,
        });

        return true;
      }

      set({
        loginResponse: {
          ok: false,
          message: response.message || "Credenciales incorrectas",
        },
        isLoggingIn: false,
      });
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      set({
        loginResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoggingIn: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({
      isLoggingOut: true,
      logoutResponse: initialResponse,
    });

    try {
      const response = await logoutAPI();

      if (response?.ok) {
        set({
          user: null,
          tokens: initialTokens,
          isAuthenticated: false,
          logoutResponse: {
            ok: true,
            message: response.message,
          },
          isLoggingOut: false,
        });
        return true;
      }

      set({
        logoutResponse: {
          ok: false,
          message: response?.message || "Error al cerrar sesión",
        },
        isLoggingOut: false,
      });
      return false;
    } catch (error) {
      console.error("Error en logout:", error);
      
      set({
        user: null,
        tokens: initialTokens,
        isAuthenticated: false,
        logoutResponse: {
          ok: false,
          message: "Error al cerrar sesión, pero se limpió la sesión local",
        },
        isLoggingOut: false,
      });
      return false;
    }
  },

  validateSession: async () => {
    const { tokens } = get();
    
    if (!tokens.token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isValidatingSession: true });

    try {
      const response = await meAPI();

      if (response?.ok && response.data) {
        set({
          user: response.data,
          isAuthenticated: true,
          isValidatingSession: false,
        });
      } else {
        set({
          user: null,
          tokens: initialTokens,
          isAuthenticated: false,
          isValidatingSession: false,
        });
      }
    } catch (error) {
      console.error("Error en validateSession:", error);
      set({
        user: null,
        tokens: initialTokens,
        isAuthenticated: false,
        isValidatingSession: false,
      });
    }
  },

  forgotPassword: async (data) => {
    set({
      isForgotPasswordLoading: true,
      forgotPasswordResponse: initialResponse,
    });

    try {
      const response = await forgotPasswordAPI(data);

      if (!response) {
        set({
          forgotPasswordResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isForgotPasswordLoading: false,
        });
        return false;
      }

      if (response.ok) {
        set({
          forgotPasswordResponse: {
            ok: true,
            message: response.message || "Correo enviado correctamente",
          },
          isForgotPasswordLoading: false,
        });
        return true;
      }

      set({
        forgotPasswordResponse: {
          ok: false,
          message: response.message || "Error al recuperar contraseña",
        },
        isForgotPasswordLoading: false,
      });
      return false;
    } catch (error) {
      console.error("Error en forgotPassword:", error);
      set({
        forgotPasswordResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isForgotPasswordLoading: false,
      });
      return false;
    }
  },

  clearLoginResponse: () => set({ loginResponse: initialResponse }),
  clearLogoutResponse: () => set({ logoutResponse: initialResponse }),
  clearForgotPasswordResponse: () => set({ forgotPasswordResponse: initialResponse }),

  setUser: (newUserData: Partial<Usuario>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    set({
      user: {
        ...currentUser,
        ...newUserData,
      },
    });
  },
});