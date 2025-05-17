import { useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/userStore";
import "./Navbar.css";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useUserStore();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Botón hamburguesa (o X) */}
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

        {/* Contenedor de navegación */}
    <div className={`navbar__mobileMenu ${menuOpen ? "flex" : "hidden"}`}>
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="text-green-500">Django</span>
            <span className="text-white ml-1">Films</span>
          </Link>

          {/* Auth */}
          {!user ? (
            <>
              <button onClick={onLoginClick} className="navbar__item navbar__item--hoverable">
                Sign In
              </button>
              <button onClick={onRegisterClick} className="navbar__item navbar__item--hoverable">
                Create Account
              </button>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="navbar__item text-green-500">
                {user.username}
              </button>
              {menuOpen && (
                <div className="navbar__dropdown">
                  <Link to="/profile" className="navbar__dropdownItem" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button
                    className="navbar__dropdownItem w-full text-left"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Links */}
          <Link to="/films" className="navbar__item navbar__item--hoverable">Films</Link>
          <Link to="/lists" className="navbar__item navbar__item--hoverable">Lists</Link>
          <Link to="/members" className="navbar__item navbar__item--hoverable">Members</Link>

          {/* Buscador */}
          <div className={`navbar__searchGroup ${searchOpen ? "search-open" : ""}`}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="navbar__searchIcon"
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              {searchOpen ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.364 5.636a1 1 0 0 0-1.414-1.414L12 9.172 7.05 4.222A1 1 0 0 0 5.636 5.636L10.586 10.586 5.636 15.536a1 1 0 1 0 1.414 1.414L12 12.828l4.95 4.95a1 1 0 0 0 1.414-1.414L13.414 10.586l4.95-4.95z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="navbar__searchInput"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
