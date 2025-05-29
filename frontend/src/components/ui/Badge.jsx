import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Badge({
  label,
  onClick,
  to,
  className = "",
  color = "bg-zinc-800",
  textColor = "text-white",
  hoverColor = "hover:bg-green-600",
}) {
  const content = (
    <div
      onClick={onClick}
      className={`px-3 py-1 rounded text-sm cursor-pointer transition-colors duration-200 ${color} ${textColor} ${hoverColor} ${className}`}
    >
      {label}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <div>{content}</div>;
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  textColor: PropTypes.string,
  hoverColor: PropTypes.string,
};
