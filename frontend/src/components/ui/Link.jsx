import { Link as RouterLink } from "react-router-dom";
import "./css/Link.css";

export default function Link({ to, children, variant = "default", className = "", ...props }) {
  const variantClass = variant ? `ui-link--${variant}` : "";
  return (
    <RouterLink
      to={to}
      className={`${variantClass} ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
}