// components/ui/ButtonLink.jsx
import { Link } from "react-router-dom";
import "./ButtonLink.css";

export function ButtonLink({ to, children, ...props }) {
  return (
    <Link to={to} className="button-link" {...props}>
      {children}
    </Link>
  );
}
