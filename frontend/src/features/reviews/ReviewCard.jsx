import PropTypes from "prop-types";
import { Heart as LucideHeart } from "lucide-react";
import { PiStarFill } from "react-icons/pi";
import FilmCard from "../films/FilmCard";

export default function ReviewCard({ review }) {
  const film = review.film || {};

  return (
    <div className="flex gap-4 border-b border-zinc-800 pb-6">
      {/* Poster */}
      <FilmCard
        id={film.id || 0}
        title={film.title || ""}
        posterUrl={film.posterUrl || ""}
        year={review.film.year}
        size="sm"
        showUserActions={false}
      />

      {/* Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-white font-bold text-base sm:text-lg">
            {film.title}
          </h3>
          <span className="text-sm text-zinc-400">{review.date}</span>
          {review.rating && (
            <div className="flex items-center text-red-500 text-sm ml-2">
              {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                <PiStarFill key={i} />
              ))}
              {review.rating % 1 !== 0 && <span className="ml-1">½</span>}
            </div>
          )}
        </div>

        {/* Author */}
        <p className="text-sm text-zinc-400 mb-2">
          <span className="font-semibold text-white">@{review.author}</span>
        </p>

        {/* Text */}
        <p className="text-sm text-gray-300 leading-snug line-clamp-3">
          {review.body}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <LucideHeart
              size={14}
              strokeWidth={1.5}
              className="text-green-500"
            />
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
};
