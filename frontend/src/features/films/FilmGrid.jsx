import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import FilmCard from "./FilmCard";
import { getFilmsByPerson } from "../../services/films/persons";
import { Button } from "@/components/ui/Button";
import FilterSortBar from "./grid_adds/FilterSortBar";
import DropdownSelector from "./grid_adds/DropdownSelector";
import { useSearchParams } from "react-router-dom";

const gridClassMap = {
  sm: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  md: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  lg: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  xl: "grid-cols-1 sm:grid-cols-2",
};

const pageSizes = {
  sm: 72,
  md: 20,
  lg: 12,
  xl: 6,
};

export default function FilmGrid({
  personId,
  cardSize = "md",
  filters = [],
  sortOptions = [],
  showRoleDropdown = false,
  roles = [],
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Transform searchParams into plain object to ensure reactivity
  const searchFilters = useMemo(() => {
    const query = Object.fromEntries(searchParams.entries());

    return {
      role: query.role || "Actor",
      genre: query.genre || null,
      language: query.language || null,
      sort: query.sort || null,
    };
  }, [searchParams]);

  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = useMemo(() => pageSizes[cardSize], [cardSize]);

  const fetchFilms = useCallback(
    async (signal = null) => {
      setLoading(true);
      try {
        const res = await getFilmsByPerson(
          personId,
          searchFilters.role,
          currentPage,
          searchFilters.genre,
          searchFilters.language,
          searchFilters.sort,
          pageSize,
          signal
        );

        if (!res || typeof res !== "object" || !Array.isArray(res.results)) {
          throw new Error("Invalid film data received.");
        }

        setFilms(res.results);
        setTotalPages(Math.ceil((res.count || 0) / pageSize));
      } catch (err) {
        if (err?.code === "ERR_CANCELED") return;
        setFilms([]);
      } finally {
        setLoading(false);
      }
    },
    [
      personId,
      searchFilters.role,
      searchFilters.genre,
      searchFilters.language,
      searchFilters.sort,
      currentPage,
      pageSize,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchFilms(controller.signal);
    return () => controller.abort();
  }, [fetchFilms]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const currentRole = searchFilters.role;

  const roleOptions = Array.isArray(roles)
    ? roles.map((r) =>
        typeof r === "string"
          ? { label: r, value: r }
          : { label: `${r.role} (${r.count})`, value: r.role }
      )
    : [];

  const handleRoleChange = (role) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("role", role);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {(showRoleDropdown || filters.length > 0 || sortOptions.length > 0) && (
        <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-4">
          {showRoleDropdown && (
            <DropdownSelector
              label="Role"
              value={currentRole}
              options={roleOptions}
              onChange={handleRoleChange}
            />
          )}
          <FilterSortBar filters={filters} sortOptions={sortOptions} />
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : films?.length ? (
        <>
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

          {totalPages > 1 && (
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
          )}
        </>
      ) : (
        <p className="text-gray-400">No films found.</p>
      )}
    </div>
  );
}

FilmGrid.propTypes = {
  personId: PropTypes.string.isRequired,
  cardSize: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  showRoleDropdown: PropTypes.bool,
  roles: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        role: PropTypes.string.isRequired,
        count: PropTypes.number,
      }),
    ])
  ),
};
