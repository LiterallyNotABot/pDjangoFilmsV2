import PropTypes from "prop-types";
import FilmCard from "../films/FilmCard";
import HeartIcon from "../../components/ui/icons/HeartIcon";
import StarIcon from "../../components/ui/icons/StarIcon";
import { memo } from "react";

function ReviewCard({ review, activityMap = {}, onToggleLiked, onToggleWatched }) {
  const film = review.film || {};

  return (
    <div className="flex gap-4 border-b border-zinc-800 pb-6">
      <FilmCard
        id={film.id || 0}
        title={film.title || ""}
        posterUrl={film.posterUrl || ""}
        year={film.year}
        size="sm"
        showUserActions={true}
        activity={activityMap[film.id]}
        onToggleLiked={() => onToggleLiked(film.id)}
        onToggleWatched={() => onToggleWatched(film.id)}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-white font-bold text-base sm:text-lg">
            {film.title}
          </h3>
          <span className="text-sm text-zinc-400">{review.date ?? ""}</span>
          {review.rating && (
            <div className="flex items-center text-red-500 text-sm ml-2">
              {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                <StarIcon key={i} filled size="sm" />
              ))}
              {review.rating % 1 !== 0 && <span className="ml-1">½</span>}
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-400 mb-2">
          <span className="font-semibold text-white">@{review.author}</span>
        </p>

        <p className="text-sm text-gray-300 leading-snug line-clamp-3">
          {review.body}
        </p>

        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <HeartIcon active size="sm" />
            {review.likes || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    film: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      posterUrl: PropTypes.string,
    }),
    author: PropTypes.string.isRequired,
    date: PropTypes.string,
    rating: PropTypes.number,
    body: PropTypes.string,
    likes: PropTypes.number,
  }).isRequired,
  activityMap: PropTypes.object,
  onToggleLiked: PropTypes.func,
  onToggleWatched: PropTypes.func,
};

export default memo(ReviewCard);
