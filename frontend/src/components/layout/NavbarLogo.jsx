import { Link } from "react-router-dom";
import "./NavbarLogo.css";

export default function NavbarLogo() {
  return (
    <Link to="/" className="navbar__logo">
      <span className="navbar__logo--django">Django</span>
      <span className="navbar__logo--films">Films</span>
    </Link>
  );
}