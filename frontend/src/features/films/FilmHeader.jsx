export default function FilmHeader({ film }) {
  const director = film.crew?.find(
    (member) => member.role.name.toLowerCase() === "director"
  );

  return (
    <div className="text-white space-y-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-green-500">
        {film.title}
      </h1>

      <p className="text-sm sm:text-base text-zinc-400">
        {film.release_year} · Directed by{" "}
        <span className="text-green-400 font-semibold">
          {director ? director.person.name : "Unknown"}
        </span>
      </p>

      <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl">
        {film.synopsis}
      </p>
    </div>
  );
}
