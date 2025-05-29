import { AiFillHeart } from "react-icons/ai";
import PropTypes from "prop-types";
import clsx from "clsx";

const sizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export default function HeartIcon({
  active = false,
  size = "md",
  className = "",
  onClick,
  color,
}) {
  const px = sizeMap[size] || sizeMap.md;

const resolvedClass = clsx(
  "cursor-pointer transition",
  color
    ? color // manual override
    : active
      ? "text-green-500"
      : "text-zinc-400 hover:text-green-500",
  className
);


  return (
    <AiFillHeart
      size={px}
      onClick={onClick}
      className={resolvedClass}
    />
  );
}

HeartIcon.propTypes = {
  active: PropTypes.bool,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string, // 👈 opcional
};
