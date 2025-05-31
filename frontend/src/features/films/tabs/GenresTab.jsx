import Badge from "../../../components/ui/Badge";

export default function GenresTab({ film }) {
  const genres = film.genres || [];

  if (genres.length === 0) return null;

  return (
    <div className="text-sm text-gray-300">
      <div className="flex items-start mb-2">
        <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Genres</div>
        <div className="flex flex-wrap gap-2 items-start min-h-[2rem]">
          {genres.map((g, i) => (
            <Badge key={i} label={g.genre_name} type="genre" id={g.genre_id} />
          ))}
        </div>
      </div>
    </div>
  );
}
