import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Heart, MoreHorizontal, PenLine } from "lucide-react";
import useUserStore from "../../store/user/userStore";
import "./css/FilmCard.css";
import StarRating from "../../components/ui/StarRating";

export default function FilmCard({
  id,
  title,
  year,
  posterUrl,
  size = "md",
  user = null,
  showUserTag = false,
  showUserActions = true,
  onOpenModal,
}) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useUserStore();

  const sizes = {
    sm: "w-21 h-30",
    md: "w-40 h-60",
    lg: "w-52 h-78",
    xl: "w-64 h-96",
  };
  const posterSize = sizes[size] || sizes.md;

  const handleClick = () => {
    if (onOpenModal) {
      onOpenModal(id);
    } else {
      navigate(`/films/${id}`, {
        state: {
          backdropUrl: user?.backdropUrl || null,
        },
      });
    }
  };

  return (
    <div className="film-card-wrapper flex flex-col items-center overflow-visible">
      <div
        className={`film-card ${posterSize} relative group`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Clic en la imagen */}
        <div className="cursor-pointer" onClick={handleClick}>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              className="h-full w-full object-cover rounded-md shadow-md transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-zinc-800 rounded-md flex items-center justify-center text-white text-sm">
              No image
            </div>
          )}
        </div>

        {/* Hover icons (sólo si logeado) */}
        {currentUser && hovered && showUserActions && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center p-1 bg-black/60 text-white rounded-b-md text-lg z-10">
            <Eye size={16} strokeWidth={1.5} className="icon eye" />
            <Heart size={16} strokeWidth={1.5} className="icon heart" />
            <MoreHorizontal size={16} strokeWidth={1.5} className="icon more" />
          </div>
        )}

        {/* Tooltip */}
        {hovered && (
          <div className="film-tooltip">
            {title} ({year})
          </div>
        )}
      </div>

      {/* Username del amigo (si aplica) */}
      {showUserTag && user?.username && (
        <div className="text-xs text-green-400 mt-1 text-center truncate max-w-full">
          {user.username}
        </div>
      )}

      {/* Iconos de actividad del amigo */}
      {showUserTag && (user?.rating || user?.liked || user?.reviewed) && (
        <div className="flex items-center justify-center gap-2 text-sm mt-1">
          {user.rating && (
            <span className="text-red-500 text-base font-semibold leading-none">
              {"★".repeat(Math.floor(user.rating))}
              {user.rating % 1 !== 0 && "½"}
            </span>
          )}
          {user.liked && (
            <Heart
              size={18}
              strokeWidth={1.5}
              className="text-green-500"
              title="Liked"
            />
          )}
          {user.reviewed && (
            <PenLine
              size={18}
              strokeWidth={1.5}
              className="text-zinc-400"
              title="Reviewed"
            />
          )}
        </div>
      )}
    </div>
  );
}

FilmCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number,
  posterUrl: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  user: PropTypes.object,
  showUserTag: PropTypes.bool,
  showUserActions: PropTypes.bool,
  onOpenModal: PropTypes.func,
};
