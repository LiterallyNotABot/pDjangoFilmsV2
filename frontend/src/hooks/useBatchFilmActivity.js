import { useEffect } from "react";
import { useFilmActivityStore } from "@/store/film/useFilmActivityStore";
import { getBatchUserFilmActivity } from "@/services/user";

export function useBatchFilmActivity(filmIds) {
  const setActivity = useFilmActivityStore((s) => s.setActivityByFilmId);

  useEffect(() => {
    if (!filmIds?.length) return;

    const controller = new AbortController();
    getBatchUserFilmActivity(filmIds, { signal: controller.signal })
      .then((data) => {
        setActivity(data); // asumimos formato { [filmId]: { ... } }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [filmIds]);
}
