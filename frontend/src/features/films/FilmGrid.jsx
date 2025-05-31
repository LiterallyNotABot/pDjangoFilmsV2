import { useState, useEffect } from "react";
import FilmCard from "./FilmCard";
import useFilmFilters from "../../hooks/useFilmFilters";
import { getFilmsByPerson } from "../../services/films/persons";

export default function FilmGrid() {
  const filters = useFilmFilters({ page: 1 });

  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(filters.page) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset page if filters (except page) change
  useEffect(() => {
    setCurrentPage(1);
  }, [JSON.stringify({ ...filters, page: undefined })]);

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      try {
        const res = await getFilmsByPerson(
          filters.personId,
          filters.role,
          currentPage,
          filters.genre,
          filters.language,
          filters.sort
        );
        setFilms(res.results);
        setTotalPages(Math.ceil(res.count / res.page_size));
      } catch (err) {
        console.error("Error loading films", err);
        setFilms([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, [filters.personId, filters.role, filters.genre, filters.language, filters.sort, currentPage]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!films?.length) return <p className="text-gray-400">No films found.</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {films.map((film) => (
          <FilmCard key={film.film_id} film={film} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
