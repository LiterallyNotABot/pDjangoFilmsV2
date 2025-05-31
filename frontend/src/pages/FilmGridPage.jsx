import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchFilmsByFilter } from "../services/films/films";
import FilmCard from "../features/films/FilmCard";

export default function FilmGridPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const filters = Object.fromEntries(searchParams.entries());
    setLoading(true);
    fetchFilmsByFilter(filters)
      .then((res) => setFilms(res.data.results))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="p-4">
      <h1 className="text-xl text-white font-bold mb-4">Films</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {films.map((film) => (
            <FilmCard key={film.film_id} film={film} />
          ))}
        </div>
      )}
    </div>
  );
}
