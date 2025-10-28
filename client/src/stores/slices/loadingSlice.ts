import type { StateCreator } from "zustand";

export type LoadingSliceType = {
  isGlobalLoading: boolean;
  setGlobalLoading: (value: boolean) => void;
};

export const createLoadingSlice: StateCreator<LoadingSliceType> = (set) => ({
  isGlobalLoading: false,
  setGlobalLoading: (value) => set({ isGlobalLoading: value }),
});
