import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUserStore from "@/store/user/userStore";
import { getUserProfile } from "@/services/users/users";
import UserHeader from "@/features/users/UserHeader";
import ProfileTab from "@/features/users/dashboard_tabs/ProfileTab";

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
          <div className="pb-2 border-b-2 border-white text-white font-semibold cursor-pointer">
            Profile
          </div>
          <div className="pb-2 cursor-not-allowed">Films</div>
          <div className="pb-2 cursor-not-allowed">Diary</div>
          <div className="pb-2 cursor-not-allowed">Reviews</div>
          <div className="pb-2 cursor-not-allowed">Watchlist</div>
          <div className="pb-2 cursor-not-allowed">Lists</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <ProfileTab username={username} />
      </div>
    </>
  );
}
