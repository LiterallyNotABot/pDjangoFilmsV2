import { useState, lazy, Suspense } from "react";
import { PencilLine } from "lucide-react";
import PropTypes from "prop-types";
import clsx from "clsx";

const LogModal = lazy(() => import("@/features/reviews/LogModal"));

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
  film = null, 
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
        className={clsx("cursor-pointer", className, { "text-primary": active })}
        size={px}
        onClick={interactive ? handleClick : undefined}
      />
      {showModal && film && (
        <Suspense fallback={<div>Cargando...</div>}>
          <LogModal open={showModal} onClose={() => setShowModal(false)} film={film} />
        </Suspense>
      )}
    </>
  );
}

PencilIcon.propTypes = {
  active: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  interactive: PropTypes.bool,
  film: PropTypes.object,
};
