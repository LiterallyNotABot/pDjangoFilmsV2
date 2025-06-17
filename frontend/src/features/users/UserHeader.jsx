import Avatar from "@/components/ui/Avatar";
import useUserStore from "@/store/user/userStore";
import { Link } from "react-router-dom";
import { Film, Calendar, UserPlus, Users } from "lucide-react";

export default function UserHeader({ profile }) {
  const { user: authUser } = useUserStore();
  const isOwnProfile = authUser?.username === profile.username;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 border-b border-zinc-800 pb-10">
      <div className="flex items-center gap-6">
        <Avatar
          src={profile.avatar_url}
          size="xxl"
          className="ring-2 ring-green-400 shadow-[0_0_12px_2px_rgba(34,197,94,0.4)]"
        />
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {profile.display_name}
          </h2>
          <p className="text-sm text-zinc-400">@{profile.username}</p>

          {authUser && (
            <div className="mt-2">
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="px-4 py-1 bg-green-500 text-black font-semibold rounded-md text-sm hover:bg-red-600 hover:text-white transition"
                >
                  Settings
                </Link>
              ) : (
                <button
                  className={`px-4 py-1 text-sm rounded-md font-semibold transition ${
                    profile.is_followed
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-500 text-black hover:bg-green-600"
                  }`}
                >
                  {profile.is_followed ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full sm:w-auto justify-end overflow-x-auto scrollbar-hide pt-5">
        <Stat
          icon={<Film size={18} className="text-white" />}
          label="Films"
          value={profile.total_films || 0}
        />
        <Stat
          icon={<Calendar size={18} className="text-white" />}
          label="This Year"
          value={profile.films_this_year || 0}
        />
        <Stat
          icon={<UserPlus size={18} className="text-white" />}
          label="Following"
          value={profile.following}
        />
        <Stat
          icon={<Users size={18} className="text-white" />}
          label="Followers"
          value={profile.followers}
        />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 px-4 py-3 rounded-md shadow-md min-w-[140px]">
      <div className="p-2 bg-zinc-800 rounded">
        {icon}
      </div>
      <div className="text-sm">
        <div className="text-white font-semibold text-base leading-tight">
          {value}
        </div>
        <div className="text-zinc-400 text-xs uppercase tracking-widest">
          {label}
        </div>
      </div>
    </div>
  );
}
