import type { StateCreator } from "zustand";
import type { Usuario, CreateUserData, UpdateUserData } from "../../../types";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../api/usersService";

const initialResponse = { ok: false, message: "" };

export type UsersSliceType = {
  // Estado principal
  users: Usuario[];
  selectedUser: Usuario | null;
  hasLoadedUsers: boolean;
  isLoadingUsers: boolean;
  usersResponse: { ok: boolean; message: string };

  // CREATE
  createUser: (data: CreateUserData) => Promise<boolean>;
  isCreatingUser: boolean;
  createUserResponse: { ok: boolean; message: string };
  clearCreateUserResponse: () => void;

  // UPDATE
  updateUser: (id: number, data: UpdateUserData) => Promise<boolean>;
  isUpdatingUser: boolean;
  updateUserResponse: { ok: boolean; message: string };
  clearUpdateUserResponse: () => void;

  // DELETE
  deleteUser: (id: number) => Promise<boolean>;
  isDeletingUser: boolean;
  deleteUserResponse: { ok: boolean; message: string };
  clearDeleteUserResponse: () => void;

  // Acciones generales
  fetchUsers: (force?: boolean) => Promise<void>;
  selectUser: (id: number) => void;
  clearSelectedUser: () => void;
  clearUsers: () => void;
};

export const createUsersSlice: StateCreator<UsersSliceType> = (set, get) => ({
  // Estado inicial
  users: [],
  selectedUser: null,
  hasLoadedUsers: false,
  isLoadingUsers: false,
  usersResponse: initialResponse,

  isCreatingUser: false,
  createUserResponse: initialResponse,

  isUpdatingUser: false,
  updateUserResponse: initialResponse,

  isDeletingUser: false,
  deleteUserResponse: initialResponse,

  fetchUsers: async (force = false) => {
    const { hasLoadedUsers } = get();
    if (hasLoadedUsers && !force) return;

    set({ isLoadingUsers: true });

    try {
      const response = await getAllUsers();

      if (!response) {
        set({
          isLoadingUsers: false,
          usersResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
        });
        return;
      }

      if (response.ok && response.data) {
        set({
          users: response.data,
          hasLoadedUsers: true,
          usersResponse: { ok: true, message: response.message },
          isLoadingUsers: false,
        });
      } else {
        set({
          usersResponse: {
            ok: false,
            message: response.message || "Error al obtener usuarios",
          },
          isLoadingUsers: false,
        });
      }
    } catch (error) {
      console.error("Error en fetchUsers:", error);
      set({
        usersResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isLoadingUsers: false,
      });
    }
  },

  createUser: async (data) => {
    set({
      isCreatingUser: true,
      createUserResponse: initialResponse,
    });

    try {
      const response = await createUser(data);

      if (!response) {
        set({
          createUserResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isCreatingUser: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        // Agregar el nuevo usuario a la lista
        set((state) => ({
          users: [...state.users, response.data!],
          createUserResponse: {
            ok: true,
            message: response.message,
          },
          isCreatingUser: false,
        }));

        return true;
      }

      set({
        createUserResponse: {
          ok: false,
          message: response.message || "Error al crear el usuario",
        },
        isCreatingUser: false,
      });
      return false;
    } catch (error) {
      console.error("Error en createUser:", error);
      set({
        createUserResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isCreatingUser: false,
      });
      return false;
    }
  },

  updateUser: async (id, data) => {
    set({
      isUpdatingUser: true,
      updateUserResponse: initialResponse,
    });

    try {
      const response = await updateUser(id, data);

      if (!response) {
        set({
          updateUserResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isUpdatingUser: false,
        });
        return false;
      }

      if (response.ok && response.data) {
        // Actualizar en la lista de usuarios
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? response.data! : user
          ),
          selectedUser:
            state.selectedUser?.id === id ? response.data : state.selectedUser,
          updateUserResponse: {
            ok: true,
            message: response.message,
          },
          isUpdatingUser: false,
        }));

        return true;
      }

      set({
        updateUserResponse: {
          ok: false,
          message: response.message || "Error al actualizar el usuario",
        },
        isUpdatingUser: false,
      });
      return false;
    } catch (error) {
      console.error("Error en updateUser:", error);
      set({
        updateUserResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isUpdatingUser: false,
      });
      return false;
    }
  },

  deleteUser: async (id) => {
    set({
      isDeletingUser: true,
      deleteUserResponse: initialResponse,
    });

    try {
      const response = await deleteUser(id);

      if (!response) {
        set({
          deleteUserResponse: {
            ok: false,
            message: "No se recibió respuesta del servidor",
          },
          isDeletingUser: false,
        });
        return false;
      }

      if (response.ok) {
        // Eliminar de la lista
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
          deleteUserResponse: {
            ok: true,
            message: response.message,
          },
          isDeletingUser: false,
        }));

        // Limpiar selección si es el usuario eliminado
        setTimeout(() => {
          const { selectedUser } = get();
          if (selectedUser?.id === id) {
            set({ selectedUser: null });
          }
        }, 300);

        return true;
      }

      set({
        deleteUserResponse: {
          ok: false,
          message: response.message || "Error al eliminar el usuario",
        },
        isDeletingUser: false,
      });
      return false;
    } catch (error) {
      console.error("Error en deleteUser:", error);
      set({
        deleteUserResponse: {
          ok: false,
          message: "Error de conexión con el servidor",
        },
        isDeletingUser: false,
      });
      return false;
    }
  },

  selectUser: (id) => {
    const { users } = get();
    const selectedUser = users.find((user) => user.id === id);

    if (selectedUser) {
      set({ selectedUser });
    } else {
      console.warn("Usuario no encontrado:", id);
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),
  clearCreateUserResponse: () => set({ createUserResponse: initialResponse }),
  clearUpdateUserResponse: () => set({ updateUserResponse: initialResponse }),
  clearDeleteUserResponse: () => set({ deleteUserResponse: initialResponse }),
  clearUsers: () =>
    set({
      users: [],
      hasLoadedUsers: false,
      usersResponse: initialResponse,
    }),
});