import Link from "../ui/Link";
import useUserStore from "../../store/user/userStore";
import "./css/UserDropdown.css";

export default function UserDropdown({ onClose }) {
  const { logout } = useUserStore();

  const handleClick = () => {
    onClose?.();
  };

  return (
    <div className="user-dropdown">
      <Link to="/profile" className="ui-link ui-link--compact" onClick={handleClick}>Profile</Link>
      <Link to="/films" className="ui-link ui-link--compact" onClick={handleClick}>Films</Link>
      <Link to="/diary" className="ui-link ui-link--compact" onClick={handleClick}>Diary</Link>
      <Link to="/reviews" className="ui-link ui-link--compact" onClick={handleClick}>Reviews</Link>
      <Link to="/watchlist" className="ui-link ui-link--compact" onClick={handleClick}>Watchlist</Link>
      <Link to="/lists" className="ui-link ui-link--compact" onClick={handleClick}>Lists</Link>
      <Link to="/likes" className="ui-link ui-link--compact" onClick={handleClick}>Likes</Link>

      <hr className="user-dropdown__separator" />

      <Link to="/settings" className="ui-link ui-link--compact" onClick={handleClick}>Settings</Link>
      <button
        onClick={() => {
          logout();
          handleClick();
        }}
        className="ui-link ui-link--compact w-full text-left"
      >
        Sign Out
      </button>
    </div>
  );
}
