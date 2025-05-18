import { useState } from "react";
import Link from "../ui/Link";
import useUserStore from "../../store/userStore";
import "./css/UserMenu.css";
import UserDropdown from "./UserDropdown";

export default function UserMenu({ onLoginClick, onRegisterClick, closeMenu }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useUserStore();

  if (!user) {
    return (
      <>
        <button onClick={onLoginClick} className="navbar__link">Sign In</button>
        <button onClick={onRegisterClick} className="navbar__link">Create Account</button>
      </>
    );
  }

  const handleClose = () => {
    setDropdownOpen(false);
    closeMenu?.();
  };

  return (
    <div className="relative">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="navbar__link">
        {user.username}
      </button>

      {dropdownOpen && (
           <UserDropdown onClose={handleClose} />
      )}
    </div>
  );
}