import PropTypes from "prop-types";
import Avatar from "../../components/ui/Avatar";
import StarIcon from "@/components/ui/icons/StarIcon";
import Tooltip from "@/components/ui/Tooltip";
import useUserStore from "@/store/user/userStore";

export default function FriendActivityBar({ filmId, friendsData }) {
  const { user } = useUserStore();

  if (!user || !friendsData?.length) return null;

  return (
    <div className="friend-activity-section border-t border-zinc-800 pt-4 mt-6">
      <div className="flex justify-between items-center text-xs text-gray-400 px-1 mb-2 uppercase tracking-wide">
        <span>Activity From Friends</span>
        <span>
          {friendsData.filter(f => f.watched).length} Watched •{" "}
          {friendsData.filter(f => f.watchlist).length} Want to Watch
        </span>
      </div>

      <div className="flex items-center gap-4">
        {friendsData.map((friend) => (
          <div key={friend.username} className="relative group">
            <Tooltip content={friend.username}>
              <Avatar src={friend.avatar} alt={friend.username} size="md" />
            </Tooltip>

            {friend.rating && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-[1px] text-green-500">
                {Array.from({ length: Math.floor(friend.rating) }).map((_, i) => (
                  <StarIcon key={i} filled size="2xs" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

FriendActivityBar.propTypes = {
  filmId: PropTypes.number.isRequired,
  friendsData: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      watched: PropTypes.bool,
      watchlist: PropTypes.bool,
      rating: PropTypes.number,
    })
  ).isRequired,
};
