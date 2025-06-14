import PropTypes from "prop-types";
import Avatar from "@/components/ui/Avatar";
import { Link } from "react-router-dom";

export default function UserBadge({ user, date, size = "md", className = "" }) {
  if (!user) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-white ${className}`}>
      <Avatar
        src={user.avatarUrl}
        alt={user.username}
        size={size}
      />
      <div className="flex flex-col">
        <Link to={`/user/${user.username}`} className="font-semibold hover:underline">
          {user.username}
        </Link>
        {date && <span className="text-xs text-zinc-400">{date}</span>}
      </div>
    </div>
  );
}

UserBadge.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
  }).isRequired,
  date: PropTypes.string,
  size: PropTypes.oneOf(["xxs", "xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
};
