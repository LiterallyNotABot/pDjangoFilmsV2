import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useUserStore from "../../store/user/userStore";
import FilmActivityFooter from "../users/FilmActivityFooter";
import Tooltip from "../../components/ui/Tooltip";
import EyeIcon from "@/components/ui/icons/EyeIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import PencilIcon from "@/components/ui/icons/PencilIcon";
import "./css/FilmCard.css";
import placeholderImg from "../../assets/no_img_placeholder.png";
import { memo } from "react";

const getSizedPosterUrl = (url, size = "md") => {
  const sizeMap = {
    sm: "w92",
    md: "w185",
    lg: "w342",
    xl: "w500",
  };
  const base = "https://image.tmdb.org/t/p/";
  const path = url?.split("/").pop();
  return `${base}${sizeMap[size]}/${path}`;
};

function FilmCard({
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
    if (onOpenModal) onOpenModal(id);
    else {
      navigate(`/films/${id}`, {
        state: { backdropUrl: user?.backdropUrl || null },
      });
    }
  };

  const imgSrc = useMemo(
    () => (posterUrl ? getSizedPosterUrl(posterUrl, size) : placeholderImg),
    [posterUrl, size]
  );

  return (
    <div className="film-card-wrapper flex flex-col items-center overflow-visible">
      <div className={`film-card ${posterSize} group z-10`}>
        {(size === "sm" || size === "md") ? (
          <Tooltip content={`${title} (${year ?? ""})`}>
            <div className="poster-click-area" onClick={handleClick}>
              <img loading="lazy" src={imgSrc} alt={title} className="film-poster-img" />
            </div>
          </Tooltip>
        ) : (
          <div className="poster-click-area" onClick={handleClick}>
            <img loading="lazy" src={imgSrc} alt={title} className="film-poster-img" />
          </div>
        )}

        {currentUser && showUserActions && (
          <div className="film-card-icons opacity-0 group-hover:opacity-100 transition">
            <EyeIcon size="md" className="hover:text-red-400" />
            <HeartIcon size="md" className="hover:text-green-400" />
            <PencilIcon size="md" className="hover:text-red-300" />
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

export default memo(FilmCard);
