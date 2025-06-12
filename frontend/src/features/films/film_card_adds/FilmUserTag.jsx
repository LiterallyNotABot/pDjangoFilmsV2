export default function FilmUserTag({ username }) {
  if (!username) return null;
  return (
    <div className="text-xs text-green-400 mt-1 text-center truncate max-w-full">
      {username}
    </div>
  );
}
