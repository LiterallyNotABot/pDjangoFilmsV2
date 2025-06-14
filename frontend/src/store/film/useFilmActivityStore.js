import { create } from "zustand";

const defaultActivity = {
  liked: false,
  watched: false,
  rating: 0,
  watchlisted: false,
};

const useFilmActivityStore = create((set, get) => ({
  activityByFilmId: {},

  setActivity: (filmId, updates) =>
    set((state) => ({
      activityByFilmId: {
        ...state.activityByFilmId,
        [filmId]: {
          ...(state.activityByFilmId[filmId] || defaultActivity),
          ...updates,
        },
      },
    })),

  getActivity: (filmId) =>
    get().activityByFilmId[filmId] || defaultActivity,

  bulkSetActivity: (entries = []) =>
    set((state) => {
      const map = { ...state.activityByFilmId };
      entries.forEach((entry) => {
        map[entry.film_id] = {
          liked: entry.liked,
          watched: entry.watched,
          rating: entry.rating || 0,
          watchlisted: entry.watchlisted,
        };
      });
      return { activityByFilmId: map };
    }),
}));

export default useFilmActivityStore;
