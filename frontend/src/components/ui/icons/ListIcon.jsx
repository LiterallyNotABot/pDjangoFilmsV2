import { List } from "lucide-react";
import PropTypes from "prop-types";
import clsx from "clsx";

const sizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export default function ListIcon({
  active = false,
  size = "md",
  className = "",
  onClick,
  interactive = true,
}) {
  const px = sizeMap[size] || sizeMap.md;

  return (
    <List
      size={px}
      strokeWidth={1.5}
      onClick={interactive ? onClick : undefined}
      className={clsx(
        "transition",
        interactive && "cursor-pointer",
        active
          ? "text-zinc-400"
          : interactive
          ? "text-zinc-400 hover:text-green-500"
          : "text-zinc-400",
        className
      )}
    />
  );
}

ListIcon.propTypes = {
  active: PropTypes.bool,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  interactive: PropTypes.bool,
};
