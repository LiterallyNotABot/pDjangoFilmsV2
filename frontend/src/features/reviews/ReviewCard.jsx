import PropTypes from "prop-types";
import FilmCard from "../films/FilmCard";
import HeartIcon from "../../components/ui/icons/HeartIcon";
import StarIcon from "../../components/ui/icons/StarIcon";
import { memo } from "react";
import useUserStore from "@/store/user/userStore";
import UserBadge from "@/features/users/UserBadge";

function ReviewCard({
  review,
  activityMap = {},
  onToggleLikedReview,
  onToggleFilmLiked,
  onToggleWatched,
  likedByUser,
  likesCount,
  likeLoading,
}) {
  const film = review.film;
  const { user } = useUserStore();
  const activity = film?.id ? activityMap[film.id] : undefined;
  const authorLikedFilm = review.film?.liked;

  return (
    <div className="flex gap-4 border-b border-zinc-800 pb-6 pt-3">
      <FilmCard
        id={film?.id || 0}
        title={film?.title || ""}
        posterUrl={film?.posterUrl || ""}
        year={film?.year}
        size="sm"
        showUserActions={true}
        user={user}
        activity={activity}
        onToggleLiked={() => onToggleFilmLiked?.(film?.id)}
        onToggleWatched={() => onToggleWatched?.(film?.id)}
      />

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-base sm:text-lg">
              {film?.title}
            </h3>

            {review.rating && (
              <div className="flex items-center text-red-500 text-sm">
                {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                  <StarIcon key={i} filled size="sm" />
                ))}
                {review.rating % 1 !== 0 && <span className="ml-1">½</span>}
              </div>
            )}

            {authorLikedFilm && (
              <HeartIcon active size="sm" className="text-green-500 ml-1" />
            )}
          </div>

          <div className="mb-2">
            <UserBadge
              user={{
                username: review.author?.username,
                avatarUrl: review.author?.avatarUrl,
              }}
              date={review.date}
              size="xs"
            />
          </div>

          <p className="text-sm text-gray-300 leading-snug line-clamp-4">
            {review.body}
          </p>
        </div>

        <div className="mt-3">
          <button
            className="group flex items-center gap-1 text-xs transition"
            disabled={likeLoading || !user}
            onClick={() => onToggleLikedReview?.(review.review_id)}
          >
            <HeartIcon
              active={likedByUser}
              size="sm"
              className={`transition ${
                likedByUser
                  ? "text-yellow-400"
                  : user
                  ? "text-zinc-400 group-hover:text-yellow-400"
                  : "text-zinc-400"
              }`}
            />
            {likesCount}
          </button>
        </div>
      </div>
    </div>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    review_id: PropTypes.number.isRequired,
    film: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      posterUrl: PropTypes.string,
      year: PropTypes.number,
      liked: PropTypes.bool,
    }),
    author: PropTypes.shape({
      username: PropTypes.string,
      avatarUrl: PropTypes.string,
    }).isRequired,
    date: PropTypes.string,
    rating: PropTypes.number,
    body: PropTypes.string,
    likes: PropTypes.number,
  }).isRequired,
  likedByUser: PropTypes.bool,
  likesCount: PropTypes.number,
  likeLoading: PropTypes.bool,
  activityMap: PropTypes.object,
  onToggleLikedReview: PropTypes.func,
  onToggleFilmLiked: PropTypes.func,
  onToggleWatched: PropTypes.func,
};

export default memo(ReviewCard);
