import { create } from "zustand";

const useListStore = create((set) => ({
  lists: [],
  loading: false,
  error: null,

  fetchLists: async (username, fetchFn) => {
    set({ loading: true, error: null });
    try {
      const lists = await fetchFn(username);
      set({ lists, loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to load lists", loading: false });
    }
  },

  setLists: (newLists) => set({ lists: newLists }), 

  addList: (list) => set((state) => ({ lists: [...state.lists, list] })),

  updateList: (updated) =>
    set((state) => ({
      lists: state.lists.map((l) => (l.id === updated.id ? updated : l)),
    })),

  removeList: (id) =>
    set((state) => ({
      lists: state.lists.filter((l) => l.id !== id),
    })),
}));

export default useListStore;