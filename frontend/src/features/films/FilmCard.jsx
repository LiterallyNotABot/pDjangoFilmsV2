import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import LogModal from "@/features/reviews/LogModal";
import FilmPosterImage from "./film_card_adds/FilmPosterImage";
import FilmUserActionsBar from "./film_card_adds/FilmUserActionsBar";
import FilmUserTag from "./film_card_adds/FilmUserTag";
import FilmActivityFooter from "./film_card_adds/FilmActivityFooter";
import { getSizedPosterUrl } from "@/utils/imageUtils";
import noImgPlaceholder from "@/assets/no_img_placeholder.png";
import "./css/FilmCard.css";

export default function FilmCard({
  id,
  title,
  year,
  posterUrl,
  backdropUrl,
  size = "md",
  activity = {},
  user = null,
  showUserTag = false,
  showUserActions = true,
  onOpenModal,
  onToggleWatched,
  onToggleLiked,
}) {
  const navigate = useNavigate();
  const [showLogModal, setShowLogModal] = useState(false);

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
        state: { backdropUrl },
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
        <FilmPosterImage
          title={title}
          year={year}
          src={imgSrc}
          size={size}
          onClick={handleClick}
        />

        {showUserActions && user && (
          <FilmUserActionsBar
            watched={activity.watched}
            liked={activity.liked}
            onToggleWatched={() => onToggleWatched?.(id)}
            onToggleLiked={() => onToggleLiked?.(id)}
            onReview={() => setShowLogModal(true)}
          />
        )}
      </div>

      {showUserTag && <FilmUserTag username={user?.username} />}
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
        onSave={() => setShowLogModal(false)}
      />
    </div>
  );
}

FilmCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number,
  posterUrl: PropTypes.string,
  backdropUrl: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  activity: PropTypes.object,
  user: PropTypes.object,
  showUserTag: PropTypes.bool,
  showUserActions: PropTypes.bool,
  onOpenModal: PropTypes.func,
  onToggleWatched: PropTypes.func,
  onToggleLiked: PropTypes.func,
};
