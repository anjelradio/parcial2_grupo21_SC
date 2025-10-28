import type { StateCreator } from "zustand";

export type ModalName = "editUser" | "deleteUser";

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
