import Avatar from "@/components/ui/Avatar";
import useUserStore from "@/store/user/userStore";
import { Link } from "react-router-dom";

export default function UserHeader({ profile }) {
  const { user: authUser } = useUserStore();
  const isOwnProfile = authUser?.username === profile.username;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 border-b border-gray-700 pb-6">
      <div className="flex items-center gap-6">
        <Avatar src={profile.avatar_url} size="xxl" className="ring-2 ring-gray-600" />
        <div className="space-y-1">
          <h2 className="text-4xl font-semibold text-white">{profile.display_name}</h2>
          <p className="text-base text-gray-400">@{profile.username}</p>
          {authUser && (
            <div className="mt-2">
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="px-4 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                >
                  Profile Settings
                </Link>
              ) : (
                <button
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-500"
                >
                  {profile.is_followed ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap sm:flex-col gap-3 text-sm text-gray-400 sm:text-right">
        <span>
          <strong className="text-white">{profile.total_films || 0}</strong> films
        </span>
        <span>
          <strong className="text-white">{profile.films_this_year || 0}</strong> this year
        </span>
        <span>
          <strong className="text-white">{profile.following}</strong> following
        </span>
        <span>
          <strong className="text-white">{profile.followers}</strong> followers
        </span>
      </div>
    </div>
  );
}
