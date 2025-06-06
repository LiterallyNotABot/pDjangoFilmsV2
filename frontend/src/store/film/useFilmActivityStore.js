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

  getActivity: (filmId) =>
    get().activityByFilmId[filmId] || {
      liked: false,
      watched: false,
      rating: 0,
      watchlisted: false,
    },
}));


export default useFilmActivityStore;
