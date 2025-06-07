import { create } from "zustand";

const useFilmActivityStore = create((set, get) => ({
  activityByFilmId: {},

  setActivity: (filmId, updates) =>
    set((state) => ({
      activityByFilmId: {
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
      },
    })),

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
}));


export default useFilmActivityStore;
