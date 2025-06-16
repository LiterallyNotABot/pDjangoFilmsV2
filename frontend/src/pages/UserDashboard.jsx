import { Routes, Route, NavLink, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "@/store/user/userStore";
import { getUserProfile } from "@/services/users/users";
import UserHeader from "@/features/users/UserHeader";
import ProfileTab from "@/features/users/dashboard_tabs/ProfileTab";
import FilmsTab from "@/features/users/dashboard_tabs/FilmsTab";
import WatchlistTab from "@/features/users/dashboard_tabs/WatchlistTab"; // ✅ nuevo tab

export default function UserDashboard() {
  const { username } = useParams();
  const { user: authUser } = useUserStore();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }

    if (username) fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">Loading profile...</div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-400">User not found.</div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <UserHeader profile={profile} />

        <div className="flex gap-6 border-b border-gray-600 text-gray-400 text-sm overflow-x-auto scrollbar-hide">
          <NavLink
            to={`/user/${username}/profile`}
            className={({ isActive }) =>
              `pb-2 border-b-2 ${
                isActive
                  ? "border-white text-white font-semibold"
                  : "border-transparent"
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to={`/user/${username}/films`}
            className={({ isActive }) =>
              `pb-2 border-b-2 ${
                isActive
                  ? "border-white text-white font-semibold"
                  : "border-transparent"
              }`
            }
          >
            Films
          </NavLink>
          <NavLink
            to={`/user/${username}/watchlist`}
            className={({ isActive }) =>
              `pb-2 border-b-2 ${
                isActive
                  ? "border-white text-white font-semibold"
                  : "border-transparent"
              }`
            }
          >
            Watchlist
          </NavLink>
          <button className="pb-2 cursor-not-allowed">Diary</button>
          <button className="pb-2 cursor-not-allowed">Reviews</button>
          <button className="pb-2 cursor-not-allowed">Lists</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileTab username={username} />} />
          <Route path="films" element={<FilmsTab username={username} />} />
          <Route path="watchlist" element={<WatchlistTab username={username} />} />
        </Routes>
      </div>
    </>
  );
}
