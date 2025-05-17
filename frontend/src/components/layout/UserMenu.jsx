import { useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/userStore";
import "./UserMenu.css";

export default function UserMenu({ onLoginClick, onRegisterClick, closeMenu }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useUserStore();

  if (!user) {
    return (
      <>
        <button onClick={onLoginClick} className="navbar__item navbar__item--hoverable">
          Sign In
        </button>
        <button onClick={onRegisterClick} className="navbar__item navbar__item--hoverable">
          Create Account
        </button>
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="navbar__item"
      >
        {user.username}
      </button>
      {dropdownOpen && (
        <div className="navbar__dropdown">
          <Link to="/profile" className="navbar__dropdownItem" onClick={() => setDropdownOpen(false)}>
            Profile
          </Link>
          <button
            className="navbar__dropdownItem w-full text-left"
            onClick={() => {
              logout();
              setDropdownOpen(false);
              closeMenu();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
