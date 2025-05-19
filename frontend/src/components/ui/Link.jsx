import { Link as RouterLink } from "react-router-dom";
import "./css/Link.css";

export default function Link({ to, children, variant = "default", className = "", ...props }) {
  return (
    <RouterLink
      to={to}
      className={`ui-link ui-link--${variant} ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
}