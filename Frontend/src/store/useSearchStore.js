import { create } from "zustand";

export const useSearchStore = create((set) => ({
  query: "",
  isActive: false,
  // Acciones para modificar el estado
  setQuery: (text) => set({ query: text }),
  setIsActive: (status) => set({ isActive: status }),
  clearSearch: () => set({ query: "", isActive: false }),
}));
