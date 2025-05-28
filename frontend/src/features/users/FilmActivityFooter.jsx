// src/features/films/FilmActivityFooter.jsx
import PropTypes from "prop-types";
import { Heart, PenLine } from "lucide-react";

export default function FilmActivityFooter({ rating, liked, reviewed }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm mt-1">
      {rating && (
        <span className="text-red-500 text-base font-semibold leading-none">
          {"★".repeat(Math.floor(rating))}
          {rating % 1 !== 0 && "½"}
        </span>
      )}
      {liked && (
        <Heart
          size={18}
          strokeWidth={1.5}
          className="text-green-500"
          title="Liked"
        />
      )}
      {reviewed && (
        <PenLine
          size={18}
          strokeWidth={1.5}
          className="text-zinc-400"
          title="Reviewed"
        />
      )}
    </div>
  );
}

FilmActivityFooter.propTypes = {
  rating: PropTypes.number,
  liked: PropTypes.bool,
  reviewed: PropTypes.bool,
};
