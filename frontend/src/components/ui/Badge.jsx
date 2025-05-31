import PropTypes from "prop-types";
import Link from "./Link";

export default function Badge({
  label,
  type = "noop",
  id = null,
  to = null,
  onClick,
  className = "",
  color = "bg-zinc-800",
  textColor = "text-white",
  hoverColor = "hover:bg-green-600",
}) {
  const resolvedTo = to || getBadgeRoute({ type, id });

  // Solo aplicar clases personalizadas si NO es Link
  const styleClasses = !resolvedTo
    ? `inline-flex items-center justify-center px-3 py-1 rounded text-sm transition-colors duration-200 ${color} ${textColor} ${hoverColor} ${className}`
    : className;

  if (resolvedTo) {
    return (
      <Link to={resolvedTo} variant="badge" className={styleClasses}>
        {label}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={styleClasses}>
      {label}
    </div>
  );
}
function getBadgeRoute({ type, id, role }) {
  if (!id) return null;

  switch (type) {
    case "person":
      return `/person/${id}${role ? `?role=${encodeURIComponent(role)}` : ""}`;
    case "genre":
      return `/films?genre=${id}`;
    case "language":
      return `/films?language=${id}`;
    case "country":
      return `/films?country=${id}`;
    case "company":
      return `/films?company=${id}`;
    default:
      return null;
  }
}


Badge.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["person", "genre", "company", "noop", "static"]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  to: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  color: PropTypes.string,
  textColor: PropTypes.string,
  hoverColor: PropTypes.string,
};
