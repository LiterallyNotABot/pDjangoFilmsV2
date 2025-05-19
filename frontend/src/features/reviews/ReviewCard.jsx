import PropTypes from "prop-types";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";
import FilmCard from "../films/FilmCard";

export default function ReviewCard({ review }) {
  return (
    <div className="flex gap-4 border-b border-zinc-800 pb-6">
      {/* Poster */}
        <FilmCard
        id={review.id || 0}
        title={review.filmTitle}
        posterUrl={review.posterUrl}
        size="sm"
        showUserActions={false}
        />


      {/* Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-white font-bold text-base sm:text-lg">
            {review.filmTitle}
          </h3>
          <span className="text-sm text-zinc-400">{review.date}</span>
          {review.rating && (
            <div className="flex items-center text-green-400 text-sm ml-2">
              {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                <PiStarFill key={i} />
              ))}
            </div>
          )}
        </div>

        {/* Author */}
        <p className="text-sm text-zinc-400 mb-2">
          <span className="font-semibold text-white">@{review.author}</span>
        </p>

        {/* Text */}
        <p className="text-sm text-gray-300 leading-snug line-clamp-3">
          {review.text}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <FaHeart className="text-pink-500" /> {review.likes}
          </span>
          <span className="flex items-center gap-1">
            <FaRegCommentDots /> {review.comments || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    filmTitle: PropTypes.string.isRequired,
    posterUrl: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string,
    rating: PropTypes.number,
    text: PropTypes.string,
    likes: PropTypes.number,
    comments: PropTypes.number,
  }).isRequired,
};
