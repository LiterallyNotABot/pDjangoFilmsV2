import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Agregado
import "./css/FilmCard.css";

export default function FilmCard({
  id,
  title,
  year,
  posterUrl,
  size = "md",
  user = null,
  showUserTag = false,
  showUserActions = true,
  onOpenModal
}) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate(); // 👈 para redireccionar

  const sizes = {
    sm: "w-21 h-30",
    md: "w-40 h-60",
    lg: "w-52 h-78",
    xl: "w-64 h-96"
  };
  const posterSize = sizes[size] || sizes.md;

  const handleClick = () => {
    if (onOpenModal) {
      onOpenModal(id);
    } else {
      navigate(`/films/${id}`);
    }
  };

  return (
    <div
      className={`film-card ${posterSize} relative cursor-pointer group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <img
        src={posterUrl}
        alt={title}
        className="h-full w-full object-cover rounded-md shadow-md transition-transform duration-200 group-hover:scale-105"
      />

      {showUserActions && user && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center p-1 bg-black/60 text-white rounded-b-md text-lg">
          {user.watched && <span className="icon eye">👁️</span>}
          {user.liked && <span className="icon heart">❤️</span>}
          <span className="icon more">⋯</span>
        </div>
      )}

      {showUserTag && user?.username && (
        <div className="text-xs text-green-400 mt-1 text-center truncate">
          {user.username}
        </div>
      )}

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

      {hovered && (
        <div className="film-tooltip">
          {title} ({year})
        </div>
      )}
    </div>
  );
}
