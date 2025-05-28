export default function FilmFacts({ film }) {
  const genreList = film.genres?.map((g) => g.genre_name).join(", ");

  return (
    <div className="bg-zinc-900 p-5 rounded-xl shadow-md text-sm text-gray-300 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">⏱ Duration:</span>
        <span className="text-white font-medium">{film.runtime} min</span>
      </div>

      <div className="flex items-start justify-between">
        <span className="text-zinc-400">🎬 Genres:</span>
        <span className="text-white text-right max-w-xs">{genreList}</span>
      </div>

      {film.status && (
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">📽 Status:</span>
          <span className="text-white">{film.status}</span>
        </div>
      )}

      {film.budget > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">💰 Budget:</span>
          <span className="text-white">${film.budget.toLocaleString()}</span>
        </div>
      )}

      {film.revenue > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">💵 Revenue:</span>
          <span className="text-white">${film.revenue.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
