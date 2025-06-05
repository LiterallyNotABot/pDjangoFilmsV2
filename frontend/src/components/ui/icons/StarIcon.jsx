import { PiStarFill, PiStarThin } from "react-icons/pi";
import PropTypes from "prop-types";
import clsx from "clsx";

const sizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export default function StarIcon({
  filled = false,
  half = false,
  size = "md",
  className = "",
}) {
  const px = sizeMap[size] || sizeMap.md;

  return (
    <span
      className={clsx("relative inline-block", className)}
      style={{ width: px, height: px }}
    >
      <PiStarThin size={px} className="text-zinc-500 absolute top-0 left-0" />
      {(filled || half) && (
        <span
          className="absolute top-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: half ? px / 2 : px, height: px }}
        >
          <PiStarFill size={px} className="text-red-500" />
        </span>
      )}
    </span>
  );
}

StarIcon.propTypes = {
  filled: PropTypes.bool,
  half: PropTypes.bool,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
};
