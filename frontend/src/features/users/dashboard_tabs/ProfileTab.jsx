import { useEffect, useState, useCallback } from "react";
import { getUserDashboard } from "@/services/users/users";
import StaticFilmGrid from "@/features/films/StaticFilmGrid";
import ReviewFeed from "@/features/reviews/ReviewFeed";
import FilmCard from "@/features/films/FilmCard";
import ListCard from "@/features/users/ListCard";
import useUserStore from "@/store/user/userStore";
import placeholderImg from "@/assets/select_fav_placeholder.png";
import useUserFilmToggle from "@/hooks/useUserFilmToggle";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import UserRatingStats from "@/features/users/UserRatingStats";
import { transformRatingStats } from "@/utils/transformers";

export default function ProfileTab({ username }) {
  const { user } = useUserStore();
  const { activityByFilmId, setActivity, bulkSetActivity } =
    useFilmActivityStore();
  const toggleUserFilmActivity = useUserFilmToggle(
    activityByFilmId,
    setActivity
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserDashboard(username);
        setData(res);

        if (res?.activity) {
          const bulkActivity = res.activity.map((film) => ({
            film_id: film.id,
            liked: film.activity?.liked || false,
            watched: film.activity?.watched || false,
            rating: film.activity?.rating || 0,
            watchlisted: film.activity?.watchlisted || false,
          }));
          bulkSetActivity(bulkActivity);
        }
      } catch {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }

    if (username) fetchData();
  }, [username, bulkSetActivity]);

  const favoriteFilms = data?.favorites ? [...data.favorites] : [];
  while (favoriteFilms.length < 4) favoriteFilms.push(null);

  const recentActivityFilms = data?.activity?.slice(0, 4) || [];
  const watchlistFilms = data?.watchlist?.slice(0, 6) || [];

  const activityReady = !!data && Object.keys(activityByFilmId).length > 0;
  const userRatingStats = transformRatingStats(data?.stats);

  const renderFilmCard = useCallback(
    (film) => (
      <FilmCard
        key={film.id}
        id={film.id}
        title={film.title}
        year={film.year}
        posterUrl={film.posterUrl}
        backdropUrl={film.backdropUrl}
        user={user}
        showUserActions={!!user}
        activity={activityByFilmId[film.id]}
        onToggleWatched={() => toggleUserFilmActivity(film.id, "watched")}
        onToggleLiked={() => toggleUserFilmActivity(film.id, "liked")}
      />
    ),
    [user, activityByFilmId, toggleUserFilmActivity]
  );

  if (loading)
    return (
      <div className="text-center py-10 text-gray-400">Loading profile...</div>
    );
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-10">
      <div className="space-y-10">
        <StaticFilmGrid
          title="Favorite Films"
          items={favoriteFilms}
          renderItem={(film) =>
            film ? (
              <FilmCard film={film} />
            ) : (
              <img
                src={placeholderImg}
                alt="Select a film"
                className="w-full aspect-[2/3] rounded border border-zinc-700 object-cover"
              />
            )
          }
        />

        <hr className="border-gray-300" />

        {recentActivityFilms.length > 0 && (
          <>
            <StaticFilmGrid
              title="Recent Activity"
              items={recentActivityFilms}
              renderItem={renderFilmCard}
            />
            <hr className="border-gray-300" />
          </>
        )}

        {data.reviews?.recent?.length > 0 && (
          <>
            <ReviewFeed
              title="Recent Reviews"
              reviews={data.reviews.recent}
              activityReady={activityReady}
            />
            <hr className="border-gray-300" />
          </>
        )}

        {data.reviews?.popular?.length > 0 && (
          <>
            <ReviewFeed
              title="Popular Reviews"
              reviews={data.reviews.popular}
              activityReady={activityReady}
            />
          </>
        )}
      </div>

      <div className="space-y-10 md:sticky md:top-24 self-start flex flex-col items-center w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">Watchlist</h2>
        <ListCard
          list={{
            id: "watchlist-preview",
            title: "Watchlist",
            user: null,
            films: watchlistFilms,
            likes: 0,
            likedByUser: false,
          }}
          activityMap={activityByFilmId}
          onToggleLiked={(id) => toggleUserFilmActivity(id, "liked")}
          onToggleWatched={(id) => toggleUserFilmActivity(id, "watched")}
          showLikeButton={false}
        />
        <div className="w-full mt-6 px-4">
          <UserRatingStats stats={userRatingStats} />
        </div>
      </div>
    </div>
  );
}
