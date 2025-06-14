import { useCallback } from "react";
import { patchUserFilmActivity } from "@/services/users/users";

export default function useUserFilmToggle(activityMap, setActivityForFilm) {
  return useCallback(
    async (filmId, field) => {
      if (!filmId || !field) return;
      const current = activityMap[filmId]?.[field];
      const newValue = !current;

      try {
        await patchUserFilmActivity(filmId, { [field]: newValue });
        setActivityForFilm(filmId, { [field]: newValue });
      } catch (err) {
        console.error("Failed to update activity:", err);
      }
    },
    [activityMap, setActivityForFilm]
  );
}
