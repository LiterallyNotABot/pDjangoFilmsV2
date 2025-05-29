import { PlusCircle } from "lucide-react";
import PropTypes from "prop-types";
import clsx from "clsx";

const sizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export default function PlusIcon({ active = false, size = "md", className = "", onClick }) {
  const px = sizeMap[size] || sizeMap.md;

  return (
    <PlusCircle
      size={px}
      strokeWidth={1.5}
      onClick={onClick}
      className={clsx(
        "cursor-pointer transition",
        active ? "text-yellow-400" : "text-zinc-400 hover:text-yellow-400",
        className
      )}
    />
  );
}

PlusIcon.propTypes = {
  active: PropTypes.bool,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};
