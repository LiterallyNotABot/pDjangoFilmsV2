import PropTypes from "prop-types";
import defaultAvatar from "@/assets/profpic_placeholder.png";
import clsx from "clsx";

const sizeMap = {
  xxs: "w-4 h-4",   // 16px
  xs: "w-6 h-6",    // 24px
  sm: "w-8 h-8",    // 32px
  md: "w-10 h-10",  // 40px
  lg: "w-12 h-12",  // 48px
  xl: "w-16 h-16",  // 64px
};

export default function Avatar({ src, alt, size = "md", className = "" }) {
  const fallback = defaultAvatar;
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <img
      src={src || fallback}
      alt={alt}
      className={clsx(
        sizeClass,
        "rounded-full object-cover ring-1 ring-zinc-700",
        className
      )}
      onError={(e) => (e.currentTarget.src = fallback)}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["xxs", "xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
};
