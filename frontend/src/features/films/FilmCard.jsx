import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import useUserStore from "../../store/user/userStore";
import FilmActivityFooter from "../users/FilmActivityFooter";
import Tooltip from "../../components/ui/Tooltip";
import EyeIcon from "@/components/ui/icons/EyeIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import PencilIcon from "@/components/ui/icons/PencilIcon";
import LogModal from "@/features/reviews/LogModal";
import { getSizedPosterUrl } from "@/utils/imageUtils";
import "./css/FilmCard.css";
import noImgPlaceholder from "@/assets/no_img_placeholder.png";
import useFilmUserActivity from "@/hooks/useFilmUserActivity";

function FilmCard({
  id,
  title,
  year,
  posterUrl,
  backdropUrl,
  size = "md",
  user = null,
  showUserTag = false,
  showUserActions = true,
  onOpenModal,
}) {
  const navigate = useNavigate();
  const { user: currentUser } = useUserStore();
  const [showLogModal, setShowLogModal] = useState(false);
  const { liked, watched, updateField, refetch } = useFilmUserActivity(id);

  const sizes = {
    sm: "w-21 h-30",
    md: "w-40 h-60",
    lg: "w-52 h-78",
    xl: "w-64 h-96",
  };
  const posterSize = sizes[size] || sizes.md;

  const handleClick = () => {
    if (onOpenModal) onOpenModal(id);
    else {
      navigate(`/films/${id}`, {
        state: { backdropUrl }, // ✅ Usamos el prop correctamente
      });
    }
  };

  const imgSrc = useMemo(() => {
    const url = getSizedPosterUrl(posterUrl, size);
    return url || noImgPlaceholder;
  }, [posterUrl, size]);

  return (
    <div className="film-card-wrapper flex flex-col items-center overflow-visible">
      <div className={`film-card ${posterSize} group z-10`}>
        {size === "sm" || size === "md" ? (
          <Tooltip content={`${title} (${year ?? ""})`}>
            <div className="poster-click-area" onClick={handleClick}>
              <img
                loading="lazy"
                src={imgSrc}
                alt={title}
                className="film-poster-img"
              />
            </div>
          </Tooltip>
        ) : (
          <div className="poster-click-area" onClick={handleClick}>
            <img
              loading="lazy"
              src={imgSrc}
              alt={title}
              className="film-poster-img"
            />
          </div>
        )}

        {currentUser && showUserActions && (
          <div className="film-card-icons opacity-0 group-hover:opacity-100 transition">
            <EyeIcon
              size="md"
              active={watched}
              className="hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                updateField("watched", !watched);
              }}
            />
            <HeartIcon
              size="md"
              active={liked}
              className="hover:text-green-400"
              onClick={(e) => {
                e.stopPropagation();
                updateField("liked", !liked);
              }}
            />
            <PencilIcon
              size="md"
              className="hover:text-red-300"
              onClick={() => setShowLogModal(true)}
            />
          </div>
        )}
      </div>

      {showUserTag && user?.username && (
        <div className="text-xs text-green-400 mt-1 text-center truncate max-w-full">
          {user.username}
        </div>
      )}

      {showUserTag && user && (
        <FilmActivityFooter
          rating={user.rating}
          liked={user.liked}
          reviewed={user.reviewed}
        />
      )}

      <LogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        film={{
          id,
          title,
          year,
          posterUrl: getSizedPosterUrl(posterUrl, "md") || noImgPlaceholder,
        }}
        onSave={() => {
          refetch();
          setShowLogModal(false);
        }}
      />
    </div>
  );
}

FilmCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number,
  posterUrl: PropTypes.string,
  backdropUrl: PropTypes.string, // ✅ lo declaramos
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  user: PropTypes.object,
  showUserTag: PropTypes.bool,
  showUserActions: PropTypes.bool,
  onOpenModal: PropTypes.func,
};

export default FilmCard;
