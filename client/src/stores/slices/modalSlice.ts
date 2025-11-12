import type { StateCreator } from "zustand";

export type ModalName =
  | "editUser"
  | "deleteUser"
  | "editMateria"
  | "deleteMateria"
  | "editGrupo"
  | "deleteGrupo"
  | "editAula"
  | "deleteAula"
  | "horarioList"
  | "editHorario"
  | "deleteHorario"
  | "diasList"
  | "editDia"
  | "deleteDia"
  | "editAsignacion"
  | "deleteAsignacion"
  | "permisoDetail"
  | "solicitudDetail"
  | "forgotPassword"
  | "editSuplencia"
  | "deleteSuplencia"
  | "asistenciaVirtualModal"
  | "cameraScanner";

export type ModalSliceType = {
  modals: Record<ModalName, boolean>;
  anyModalOpen: boolean;
  setModal: (modal: ModalName, open: boolean) => void;
  openModal: (modal: ModalName) => void;
  closeModal: (modal: ModalName) => void;
  toggleModal: (modal: ModalName) => void;
  closeAll: () => void;
};

export const createModalSlice: StateCreator<ModalSliceType> = (set, get) => ({
  modals: {
    editUser: false,
    deleteUser: false,
    editMateria: false,
    deleteMateria: false,
    editGrupo: false,
    deleteGrupo: false,
    editAula: false,
    deleteAula: false,
    horarioList: false,
    editHorario: false,
    deleteHorario: false,
    diasList: false,
    editDia: false,
    deleteDia: false,
    editAsignacion: false,
    deleteAsignacion: false,
    permisoDetail: false,
    solicitudDetail: false,
    forgotPassword: false,
    editSuplencia: false,
    deleteSuplencia: false,
    asistenciaVirtualModal: false,
    cameraScanner: false
  },
  anyModalOpen: false,
  setModal: (modal, open) => {
    set((state) => {
      const updated = { ...state.modals, [modal]: open };
      const anyStillOpen = Object.values(updated).some(Boolean);
      return { modals: updated, anyModalOpen: anyStillOpen };
    });
  },

  openModal: (modal) => get().setModal(modal, true),
  closeModal: (modal) => get().setModal(modal, false),

  toggleModal: (modal) => {
    const current = get().modals[modal];
    get().setModal(modal, !current);
  },

  closeAll: () =>
    set((state) => {
      const allClosed = Object.fromEntries(
        Object.keys(state.modals).map((m) => [m, false])
      ) as Record<ModalName, boolean>;
      return { modals: allClosed, anyModalOpen: false };
    }),
});
