import { useEffect, useState } from "react";
import {
  getUserReviews,
  getUserFilmActivityBatch,
} from "@/services/users/users";
import useUserStore from "@/store/user/userStore";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import ReviewFeed from "@/features/reviews/ReviewFeed";

export default function ReviewsTab({ username }) {
  const { user } = useUserStore();
  const { bulkSetActivity } = useFilmActivityStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityReady, setActivityReady] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getUserReviews(username);

        if (!Array.isArray(data)) {
          throw new Error("Invalid data received from getUserReviews");
        }

        setReviews(data);

        const filmIds = data
          .map((r) => r?.film?.id)
          .filter((id, index, arr) => id && arr.indexOf(id) === index);

        if (filmIds.length > 0) {
          const activity = await getUserFilmActivityBatch(filmIds);
          bulkSetActivity(activity);
        }

        setActivityReady(true);
      } catch (err) {
        console.error(err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }

    if (username) fetchReviews();
  }, [username, bulkSetActivity]);

  if (loading)
    return (
      <div className="text-center py-10 text-zinc-400 text-sm">
        Loading reviews...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 text-sm">
        {error}
      </div>
    );

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 py-8 bg-zinc-950 rounded-xl border border-zinc-800">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-wide">
          User Reviews
        </h2>
      </div>
      <ReviewFeed
        reviews={reviews}
        title=""
        activityReady={activityReady}
      />
    </div>
  );
}
