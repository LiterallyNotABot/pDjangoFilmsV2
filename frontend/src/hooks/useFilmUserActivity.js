import { useEffect, useCallback, useState } from "react";
import useUserStore from "@/store/user/userStore";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import {
  getUserFilmActivity,
  patchUserFilmActivity,
  getWatchlistStatus,
  postWatchlistEntry,
  deleteWatchlistEntry,
} from "@/services/users/users";

export default function useFilmUserActivity(filmId) {
  const { user } = useUserStore();

  const liked = useFilmActivityStore((state) => state.activityByFilmId[filmId]?.liked ?? false);
  const watched = useFilmActivityStore((state) => state.activityByFilmId[filmId]?.watched ?? false);
  const rating = useFilmActivityStore((state) => state.activityByFilmId[filmId]?.rating ?? 0);
  const watchlisted = useFilmActivityStore((state) => state.activityByFilmId[filmId]?.watchlisted ?? false);
  const setActivity = useFilmActivityStore((state) => state.setActivity);

  const [loading, setLoading] = useState(false);
  const [togglingWatchlist, setTogglingWatchlist] = useState(false);

  const fetchActivity = useCallback((signal = null) => {
    if (!user || !filmId) return;

    setLoading(true);

    Promise.all([
      getUserFilmActivity(filmId, signal),
      getWatchlistStatus(filmId, signal),
    ])
      .then(([activityData, watchlistData]) => {
        setActivity(filmId, {
          liked: activityData?.liked ?? false,
          watched: activityData?.watched ?? false,
          rating: activityData?.rating ?? 0,
          watchlisted: watchlistData?.in_watchlist ?? false,
        });
      })
      .catch((err) => {
        console.error("Activity fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [filmId, user, setActivity]);

  useEffect(() => {
    const controller = new AbortController();
    fetchActivity(controller.signal);
    return () => controller.abort();
  }, [fetchActivity]);

  const updateField = useCallback(
    (field, value) => {
      if (!user || !filmId) return;

      const isRating = field === "rating";
      const current = { liked, watched, rating }[field];
      const newValue = isRating && current === value ? 0 : value;
      if (current === newValue) return;

      const backendValue = isRating && newValue === 0 ? null : newValue;

      patchUserFilmActivity(filmId, { [field]: backendValue })
        .then(() => {
          setActivity(filmId, { [field]: newValue });
        })
        .catch((err) => {
          if (err?.code !== "ERR_CANCELED") {
            console.error(`Failed to update ${field}:`, err?.message || err);
          }
        });
    },
    [filmId, user, liked, watched, rating, setActivity]
  );

  const toggleWatchlist = useCallback(() => {
    if (!user || !filmId) return;

    setTogglingWatchlist(true);

    const action = watchlisted ? deleteWatchlistEntry : postWatchlistEntry;

    action(filmId)
      .then(() => {
        setActivity(filmId, { watchlisted: !watchlisted });
      })
      .catch((err) => {
        console.error("Failed to update watchlist:", err?.message || err);
      })
      .finally(() => setTogglingWatchlist(false));
  }, [filmId, user, watchlisted, setActivity]);

  return {
    liked,
    watched,
    rating,
    watchlisted,
    updateField,
    toggleWatchlist,
    loading,
    togglingWatchlist,
    refetch: fetchActivity, 
  };
}
