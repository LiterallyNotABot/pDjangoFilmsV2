import PropTypes from "prop-types";
import { useState } from "react";
import "./css/FilmCard.css";

export default function FilmCard({
  id,
  title,
  year,
  posterUrl,
  size = "md",
  user = null, // { username, liked, watched, rating, reviewed }
  showUserTag = false,
  showUserActions = true,
  onOpenModal
}) {
  const [hovered, setHovered] = useState(false);

const sizes = {
  sm: "w-21 h-30",
  md: "w-40 h-60", // <-- más grande
  lg: "w-52 h-78",
  xl: "w-64 h-96"
};
  const posterSize = sizes[size] || sizes.md;

  return (
    <div
      className={`film-card ${posterSize} relative cursor-pointer group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenModal?.(id)}
    >
      <img
        src={posterUrl}
        alt={title}
        className="h-full w-full object-cover rounded-md shadow-md transition-transform duration-200 group-hover:scale-105"
      />

      {/* Overlay de acciones */}
      {showUserActions && user && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center p-1 bg-black/60 text-white rounded-b-md text-lg">
          {user.watched && <span className="icon eye">👁️</span>}
          {user.liked && <span className="icon heart">❤️</span>}
          <span className="icon more">⋯</span>
        </div>
      )}

      {/* Etiqueta de usuario */}
      {showUserTag && user?.username && (
        <div className="text-xs text-green-400 mt-1 text-center truncate">
          {user.username}
        </div>
      )}

      {/* Rating / review / like debajo */}
      {(user?.rating || user?.reviewed || user?.liked) && (
        <div className="text-sm text-gray-300 flex items-center justify-center gap-1 mt-1">
          {user.rating && (
            <span className="stars text-yellow-400">
              {"★".repeat(Math.floor(user.rating))}
              {user.rating % 1 ? "½" : ""}
            </span>
          )}
          {user.liked && <span title="Liked">❤️</span>}
          {user.reviewed && <span title="Reviewed">✍️</span>}
        </div>
      )}

      {/* Tooltip al pasar el mouse */}
      {hovered && (
        <div className="film-tooltip">
          {title} ({year})
        </div>
      )}
    </div>
  );
}

FilmCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  posterUrl: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  user: PropTypes.shape({
    username: PropTypes.string,
    liked: PropTypes.bool,
    watched: PropTypes.bool,
    rating: PropTypes.number,
    reviewed: PropTypes.bool
  }),
  showUserTag: PropTypes.bool,
  showUserActions: PropTypes.bool,
  onOpenModal: PropTypes.func
};
