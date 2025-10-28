import type { StateCreator } from "zustand";
import type { UpdatePersonalInfo, UpdatePassword } from "../../types";
import { updatePassword, updatePersonalInfo } from "../../api/authService";
import type { AuthSliceType } from "./authSlice";

const initialResponse = { ok: false, message: "" };

export type ProfileSliceType = {
  isUpdatingInfo: boolean;
  updateInfoResponse: { ok: boolean; message: string };
  isUpdatingPassword: boolean;
  updatePasswordResponse: { ok: boolean; message: string };

  updatePersonalInfo: (
    id: number,
    data: UpdatePersonalInfo
  ) => Promise<boolean>;
  updatePassword: (id: number, data: UpdatePassword) => Promise<boolean>;

  clearUpdateInfoResponse: () => void;
  clearUpdatePasswordResponse: () => void;
};

export const createProfileSlice: StateCreator<
  AuthSliceType & ProfileSliceType,
  [],
  [],
  ProfileSliceType
> = (set, get) => ({
  isUpdatingInfo: false,
  updateInfoResponse: initialResponse,
  isUpdatingPassword: false,
  updatePasswordResponse: initialResponse,

  updatePersonalInfo: async (id: number, data: UpdatePersonalInfo) => {
    set({ isUpdatingInfo: true, updateInfoResponse: initialResponse });

    try {
      const response = await updatePersonalInfo(id, data);
      if (!response) {
        set({
          isUpdatingInfo: false,
          updateInfoResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return false;
      }

      if (response.ok && response.data) {
        const currentUser = get().user;

        if (currentUser) {
          set({
            user: {
              ...currentUser,
              nombre: response.data.nombre,
              apellido_paterno: response.data.apellido_paterno,
              apellido_materno: response.data.apellido_materno,
              nombre_completo: response.data.nombre_completo,
            },
          });
        }

        set({
          isUpdatingInfo: false,
          updateInfoResponse: {
            ok: true,
            message:
              response.message || "Información actualizada correctamente",
          },
        });

        return true;
      }

      set({
        isUpdatingInfo: false,
        updateInfoResponse: {
          ok: false,
          message: response.message || "Error al actualizar la información",
        },
      });
      return false;
    } catch (error) {
      console.error("Error en updatePersonalInfo:", error);
      set({
        isUpdatingInfo: false,
        updateInfoResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
      });
      return false;
    }
  },

  updatePassword: async (id: number, data: UpdatePassword) => {
    set({ isUpdatingPassword: true, updatePasswordResponse: initialResponse });

    try {
      const response = await updatePassword(id, data);

      if (!response) {
        set({
          isUpdatingPassword: false,
          updatePasswordResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return false;
      }

      set({
        isUpdatingPassword: false,
        updatePasswordResponse: {
          ok: response.ok,
          message:
            response.message ||
            (response.ok
              ? "Contraseña actualizada correctamente"
              : "Error al actualizar contraseña"),
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Error en updatePassword:", error);
      set({
        isUpdatingPassword: false,
        updatePasswordResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
      });
      return false;
    }
  },

  clearUpdateInfoResponse: () => set({ updateInfoResponse: initialResponse }),
  clearUpdatePasswordResponse: () =>
    set({ updatePasswordResponse: initialResponse }),
});
