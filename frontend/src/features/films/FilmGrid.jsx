import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FilmCard from "./FilmCard";
import useFilmFilters from "../../hooks/useFilmFilters";
import { getFilmsByPerson } from "../../services/films/persons";
import { Button } from "@/components/ui/Button";

const gridClassMap = {
  sm: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  md: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  lg: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  xl: "grid-cols-1 sm:grid-cols-2",
};

const pageSizes = {
  sm: 72, // 12x6
  md: 20, // 4x5
  lg: 12,
  xl: 6,
};

export default function FilmGrid({ personId, cardSize = "md" }) {
  const filters = useFilmFilters({ page: 1 });
  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = pageSizes[cardSize];

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      try {
        const res = await getFilmsByPerson(
          personId,
          filters.role,
          currentPage,
          filters.genre,
          filters.language,
          filters.sort,
          pageSize
        );
        setFilms(res.results);
        setTotalPages(Math.ceil(res.count / pageSize));
      } catch (err) {
        console.error("Error loading films", err);
        setFilms([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, [
    personId,
    filters.role,
    filters.genre,
    filters.language,
    filters.sort,
    currentPage,
    pageSize,
  ]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!films?.length) return <p className="text-gray-400">No films found.</p>;

  const renderPagination = () => (
    <div className="flex justify-center gap-2 mt-6 flex-wrap">
      <Button
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
      >
        {"<"}
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          variant={i + 1 === currentPage ? "primary" : "secondary"}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant="secondary"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
      >
        {">"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className={`grid gap-6 justify-center ${gridClassMap[cardSize]}`}>
        {films.map((film) => (
          <FilmCard
            key={film.id}
            id={film.id}
            title={film.title}
            year={film.year}
            posterUrl={film.posterUrl}
            size={cardSize}
          />
        ))}
      </div>
      {totalPages > 1 && renderPagination()}
    </div>
  );
}

FilmGrid.propTypes = {
  personId: PropTypes.string.isRequired,
  cardSize: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
};
