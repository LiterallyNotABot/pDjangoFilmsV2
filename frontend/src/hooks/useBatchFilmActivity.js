import { useEffect } from "react";
import useUserStore from "@/store/user/userStore";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import { getUserFilmActivityBatch } from "@/services/users/users";

export default function useBatchFilmActivity(filmIds = []) {
  const { user } = useUserStore();
  const { setActivity, activityByFilmId } = useFilmActivityStore();

  useEffect(() => {
    if (!user || !filmIds.length) return;

    const fetchBatch = async () => {
      try {
        const data = await getUserFilmActivityBatch(filmIds);
        data.forEach((entry) => {
          setActivity(entry.film_id, {
            liked: entry.liked,
            watched: entry.watched,
          });
        });
      } catch (err) {
        console.warn("Batch user film activity fetch failed:", err);
      }
    };

    fetchBatch();
  }, [user, setActivity, JSON.stringify([...filmIds].sort())]);

  const setActivityForFilm = (filmId, updates) => {
    setActivity(filmId, updates);
  };

  return {
    activityMap: activityByFilmId,
    setActivityForFilm,
  };
}
