import { create } from "zustand";

const STORAGE_KEY = "filmActivity";

const useFilmActivityStore = create((set, get) => ({
  activityByFilmId: {},

  setActivity: (filmId, updates) =>
    set((state) => {
      const activityByFilmId = {
        ...state.activityByFilmId,
        [filmId]: {
          ...(state.activityByFilmId[filmId] || {
            liked: false,
            watched: false,
            rating: 0,
            watchlisted: false,
          }),
          ...updates,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activityByFilmId));
      return { activityByFilmId };
    }),

  setActivities: (activities) =>
    set((state) => {
      const updated = { ...state.activityByFilmId };
      Object.entries(activities || {}).forEach(([id, data]) => {
        updated[id] = {
          ...(state.activityByFilmId[id] || {
            liked: false,
            watched: false,
            rating: 0,
            watchlisted: false,
          }),
          ...data,
        };
      });
      return { activityByFilmId: updated };
    }),

  getActivity: (filmId) =>
    get().activityByFilmId[filmId] || {
      liked: false,
      watched: false,
      rating: 0,
      watchlisted: false,
    },

  loadActivityFromStorage: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      set({ activityByFilmId: JSON.parse(stored) });
    }
  },
}));


export default useFilmActivityStore;
