import { Routes, Route, NavLink, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "@/store/user/userStore";
import { getUserProfile } from "@/services/users/users";
import UserHeader from "@/features/users/UserHeader";
import ProfileTab from "@/features/users/dashboard_tabs/ProfileTab";
import FilmsTab from "@/features/users/dashboard_tabs/FilmsTab";
import WatchlistTab from "@/features/users/dashboard_tabs/WatchlistTab";
import ReviewsTab from "@/features/users/dashboard_tabs/ReviewsTab";
import DiaryTab from "@/features/users/dashboard_tabs/DiaryTab";
import ListsTab from "@/features/users/dashboard_tabs/list_tab/ListsTab";

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

  if (loading)
    return (
      <div className="text-center py-10 text-zinc-400">Loading profile...</div>
    );

  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (!profile)
    return (
      <div className="text-center py-10 text-zinc-400">User not found.</div>
    );

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <UserHeader profile={profile} />

        <div className="border-b border-zinc-800 pb-1">
          <div className="flex justify-center gap-8 text-sm overflow-x-auto scrollbar-hide">
            {[
              { label: "Profile", path: "profile" },
              { label: "Films", path: "films" },
              { label: "Watchlist", path: "watchlist" },
              { label: "Reviews", path: "reviews" },
              { label: "Diary", path: "diary" },
              { label: "Lists", path: "lists" },
            ].map(({ label, path }) => (
              <NavLink
                key={path}
                to={`/user/${username}/${path}`}
                className={({ isActive }) =>
                  `pb-2 transition-all duration-150 ease-in-out border-b-2 ${
                    isActive
                      ? "border-red-500 text-white font-semibold"
                      : "border-transparent text-zinc-400 hover:text-green-400"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <Routes>
          <Route
            index
            element={<Navigate to={`/user/${username}/profile`} replace />}
          />
          <Route path="profile" element={<ProfileTab username={username} />} />
          <Route path="films" element={<FilmsTab username={username} />} />
          <Route
            path="watchlist"
            element={<WatchlistTab username={username} />}
          />
          <Route path="reviews" element={<ReviewsTab username={username} />} />
          <Route path="diary" element={<DiaryTab username={username} />} />
          <Route
            path="lists/*"
            element={<ListsTab username={username} />}
          />{" "}
        </Routes>
      </div>
    </>
  );
}
