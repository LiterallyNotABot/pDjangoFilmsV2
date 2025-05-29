import Badge from "../../../components/ui/Badge";

export default function GenresTab({ film }) {
  const genres = film.genres || [];

  if (genres.length === 0) return null;

  return (
    <div className="text-sm text-gray-300 space-y-3">
      <div className="flex items-start">
        <div className="w-40 pr-4 text-white uppercase shrink-0">GENRES</div>
        <div className="flex flex-wrap gap-2">
          {genres.map((g, i) => (
            <Badge key={i} label={g.genre_name} />
          ))}
        </div>
      </div>
    </div>
  );
}
