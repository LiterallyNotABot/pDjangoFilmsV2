import { useState } from "react";
import PropTypes from "prop-types";
import StarIcon from "./icons/StarIcon";

export default function StarRating({
  value = 0,
  onChange = () => {},
  size = "md",
  interactive = true,
  className = "",
}) {
  const [hoverValue, setHoverValue] = useState(null);

  const displayValue =
    hoverValue !== null ? Math.round(hoverValue * 2) / 2 : Math.round(value * 2) / 2;

  const handleMouseMove = (e, starIndex) => {
    if (!interactive) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const isLeftHalf = offsetX < width / 2;
    const newHover = isLeftHalf ? starIndex - 0.5 : starIndex;
    setHoverValue(newHover);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverValue(null);
  };

  const handleClick = (e, starIndex) => {
    if (!interactive) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const isLeftHalf = offsetX < width / 2;
    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    onChange(newRating);
  };

  return (
    <div className={`flex gap-[2px] ${className}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = index <= displayValue;
        const half = index - 0.5 === displayValue;

        return (
          <button
            key={index}
            type="button"
            className={interactive ? "cursor-pointer" : "cursor-default"}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={(e) => handleClick(e, index)}
            disabled={!interactive}
            style={{ background: "none", padding: 0, border: "none" }}
          >
            <StarIcon filled={filled} half={half} size={size} />
          </button>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  value: PropTypes.number.isRequired, // 0 to 5 in 0.5 steps
  onChange: PropTypes.func,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  interactive: PropTypes.bool,
  className: PropTypes.string,
};
