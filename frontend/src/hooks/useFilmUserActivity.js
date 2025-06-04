import { useEffect, useState, useCallback } from "react";
import api from "@/services/axios";
import useUserStore from "@/store/user/userStore";

export default function useFilmUserActivity(filmId) {
  const { user } = useUserStore();
  const [activity, setActivity] = useState({
    liked: false,
    watched: false,
    watchlisted: false,
    rating: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !filmId) return;

    setLoading(true);
    api
      .get(`/users/film-activity/${filmId}/`)
      .then((res) => setActivity(res.data))
      .catch((err) => console.error("Activity error:", err))
      .finally(() => setLoading(false));
  }, [filmId, user]);

  const updateField = useCallback((field, value) => {
    if (!user || !filmId) return;
    setActivity((prev) => ({ ...prev, [field]: value }));

    api
      .patch(`/users/film-activity/${filmId}/`, { [field]: value })
      .catch((err) => {
        console.error(`Failed to update ${field}:`, err);
        setActivity((prev) => ({ ...prev, [field]: !value }));
      });
  }, [filmId, user]);

  return {
    ...activity,
    updateField,
    loading,
  };
}
