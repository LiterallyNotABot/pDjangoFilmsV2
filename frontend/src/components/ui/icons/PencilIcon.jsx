import { useState, lazy, Suspense } from "react";
import { PencilLine } from "lucide-react";
import PropTypes from "prop-types";
import clsx from "clsx";
const LogModal = lazy(() => import("@/features/reviews/LogModal"));

// Función local para evitar imports fantasmas
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

export default function PencilIcon({
  active = false,
  size = "md",
  className = "",
  onClick,
  interactive = true,
  film = null, // Si se pasa film, abre LogModal automáticamente
}) {
  const sizeMap = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };

  const px = sizeMap[size] || sizeMap.md;
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
    if (film) setShowModal(true);
  };

  return (
    <>
      <PencilLine
        size={px}
        strokeWidth={1.5}
        onClick={interactive ? handleClick : undefined}
        className={clsx(
          "transition",
          interactive && "cursor-pointer",
          active
            ? "text-zinc-400"
            : interactive
            ? "text-zinc-400 hover:text-red-500"
            : "text-zinc-400",
          className
        )}
      />

      {film && (
        <LogModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          film={{
            id: film.id,
            title: film.title,
            year: film.year,
            posterUrl: getSizedPosterUrl(film.posterUrl, "md"),
          }}
          onSave={() => {
            setShowModal(false);
          }}
        />

      )}
    </>
  );
}

PencilIcon.propTypes = {
  active: PropTypes.bool,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  interactive: PropTypes.bool,
  film: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number,
    posterUrl: PropTypes.string,
  }),
};
