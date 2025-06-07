import { useEffect } from "react";
import useUserStore from "@/store/user/userStore";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import { getUserFilmActivities } from "@/services/users/users";

export default function useBulkFilmActivities(filmIds = []) {
  const { user } = useUserStore();
  const setActivities = useFilmActivityStore((state) => state.setActivities);

  useEffect(() => {
    if (!user || !Array.isArray(filmIds) || filmIds.length === 0) return;

    const controller = new AbortController();
    getUserFilmActivities(filmIds, controller.signal)
      .then((data) => {
        if (data) setActivities(data);
      })
      .catch((err) => {
        console.error("Failed to load film activities", err);
      });

    return () => controller.abort();
  }, [user, filmIds, setActivities]);
}
