import useUserStore from "../../store/user/userStore";

export default function FilmUserActions({ filmId }) {
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="bg-zinc-800 p-4 rounded text-center text-sm text-white">
        <p className="mb-2">Log in to track this film</p>
        <button className="bg-green-600 px-4 py-1 rounded">Login</button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-lg space-y-3 text-center text-white">
      <button className="hover:text-green-400">👁️ Mark as Watched</button>
      <button className="hover:text-pink-500">❤️ Like</button>
      <button className="hover:text-yellow-400">⭐ Rate</button>
      <button className="hover:text-gray-400">✍️ Review</button>
      <button className="hover:text-blue-400">➕ Add to List</button>
    </div>
  );
}
