import { useEffect, useState, useCallback } from "react";
import useUserStore from "@/store/user/userStore";
import {
  getUserFilmActivity,
  patchUserFilmActivity,
  getWatchlistStatus,
  postWatchlistEntry,
  deleteWatchlistEntry,
} from "@/services/users/users";

export default function useFilmUserActivity(filmId) {
  const { user } = useUserStore();

  const [activity, setActivity] = useState({
    liked: false,
    watched: false,
    rating: 0,
  });

  const [watchlisted, setWatchlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [togglingWatchlist, setTogglingWatchlist] = useState(false);

  useEffect(() => {
    if (!user || !filmId) return;

    setLoading(true);

    Promise.all([
      getUserFilmActivity(filmId),
      getWatchlistStatus(filmId),
    ])
      .then(([activityData, watchlistData]) => {
        if (activityData) {
          setActivity({
            liked: activityData.liked ?? false,
            watched: activityData.watched ?? false,
            rating: activityData.rating ?? 0,
          });
        }

        setWatchlisted(watchlistData?.in_watchlist ?? false);
      })
      .catch((err) => {
        console.error("Activity fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [filmId, user]);

  const updateField = useCallback(
    (field, value) => {
      if (!user || !filmId) return;

      setActivity((prev) => {
        const prevValue = prev[field];

        const isRating = field === "rating";
        const newValue = isRating && prevValue === value ? 0 : value;
        if (prevValue === newValue) return prev;

        const backendValue = isRating && newValue === 0 ? null : newValue;

        patchUserFilmActivity(filmId, { [field]: backendValue }).catch(
          (err) => {
            if (err?.code !== "ERR_CANCELED") {
              console.error(`Failed to update ${field}:`, err?.message || err);
            }
          }
        );

        return { ...prev, [field]: newValue };
      });
    },
    [filmId, user]
  );

  const toggleWatchlist = useCallback(() => {
    if (!user || !filmId) return;

    setTogglingWatchlist(true);

    const action = watchlisted
      ? deleteWatchlistEntry
      : postWatchlistEntry;

    action(filmId)
      .then(() => {
        setWatchlisted(!watchlisted);
      })
      .catch((err) => {
        console.error("Failed to update watchlist:", err?.message || err);
      })
      .finally(() => setTogglingWatchlist(false));
  }, [filmId, user, watchlisted]);

  return {
    ...activity,
    watchlisted,
    updateField,
    toggleWatchlist,
    loading,
    togglingWatchlist,
  };
}
