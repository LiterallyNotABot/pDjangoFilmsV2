import { Link as RouterLink } from "react-router-dom";
import './Link.css';

export default function Link({ to, children, ...props }) {
  return (
    <RouterLink to={to} className="ui-link" {...props}>
      {children}
    </RouterLink>
  );
}
