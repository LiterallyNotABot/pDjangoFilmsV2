import UserMenu from "./UserMenu";
import SearchBox from "./SearchBox";
import NavbarLogo from "./NavbarLogo";
import useNavbarState from "../../hooks/useNavbarState";
import useUserStore from "../../store/userStore";
import Link from "../ui/Link";
import "./css/Navbar.css";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const { menuOpen, setMenuOpen, searchOpen, setSearchOpen } = useNavbarState();
  const { user } = useUserStore();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.364 5.636a1 1 0 0 0-1.414-1.414L12 9.172 7.05 4.222A1 1 0 0 0 5.636 5.636L10.586 10.586 5.636 15.536a1 1 0 1 0 1.414 1.414L12 12.828l4.95 4.95a1 1 0 0 0 1.414-1.414L13.414 10.586l4.95-4.95z"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
            </svg>
          )}
        </button>

        <div className={`navbar__mobileMenu ${menuOpen ? "flex" : "hidden"}`}>
          <NavbarLogo />
          
          <UserMenu
            onLoginClick={onLoginClick}
            onRegisterClick={onRegisterClick}
            closeMenu={() => setMenuOpen(false)}
          />

          <Link to="/films" className="ui-link ui-link--navbar">
            Films
          </Link>
          <Link to="/lists" className="ui-link ui-link--navbar">
            Lists
          </Link>
          <Link to="/shop" className="ui-link ui-link--navbar">
            Shop
          </Link>

          <SearchBox searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
        </div>
      </div>
    </nav>
  );
}
