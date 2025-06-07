import { useMemo } from "react";

export default function FilmHeader({ film }) {
  const directorNames = useMemo(() => {
    const directors =
      film.crew?.filter(
        (member) => member.role.name.toLowerCase() === "director"
      ) || [];

    return directors.map((d) => d.person.name);
  }, [film.crew]);
  const hasDirectors = directorNames.length > 0;

  return (
    <div className="text-white space-y-4 sm:space-y-5">
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-wide text-green-600 drop-shadow-md">
        {film.title}
      </h1>

      <p className="text-sm sm:text-base text-zinc-400 tracking-wide">
        <span className="text-white font-medium">{film.release_year}</span>
        {hasDirectors && (
          <>
            <span className="mx-2 text-zinc-600">•</span>
            <span className="text-zinc-400">Directed by</span>{" "}
            <span className="text-red-500 font-semibold tracking-normal">
              {directorNames.join(", ")}
            </span>
          </>
        )}
      </p>

      <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl tracking-wide">
        {film.synopsis}
      </p>
    </div>
  );
}
