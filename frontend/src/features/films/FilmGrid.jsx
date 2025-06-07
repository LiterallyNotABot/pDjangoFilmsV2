import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import FilmCard from "./FilmCard";
import { getFilmsByPerson } from "../../services/films/persons";
import { fetchFilteredFilms } from "../../services/films/films";
import { Button } from "@/components/ui/Button";
import FilterSortBar from "./grid_adds/FilterSortBar";
import DropdownSelector from "./grid_adds/DropdownSelector";
import { useSearchParams } from "react-router-dom";

const gridClassMap = {
  sm: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12",
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
  defaultSort = "popularity",
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFilters = useMemo(() => {
    const query = Object.fromEntries(searchParams.entries());
    return {
      role: query.role || "Actor",
      genre: query.genre || null,
      language: query.language || null,
      country: query.country || null,
      company: query.company || null,
      decade: query.decade || null, // ✅ AÑADIR ESTO
      sort: query.sort || defaultSort,
    };
  }, [searchParams, defaultSort]);

  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageSize = useMemo(() => pageSizes[cardSize], [cardSize]);

  useEffect(() => {
    if (!searchParams.get("sort") && defaultSort) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("sort", defaultSort);
      setSearchParams(newParams);
    }
  }, [defaultSort, searchParams, setSearchParams]);

  const fetchFilms = useCallback(
    async (signal = null) => {
      setLoading(true);
      try {
        let res;

        if (personId) {
          res = await getFilmsByPerson(
            personId,
            searchFilters.role,
            currentPage,
            searchFilters.genre,
            searchFilters.language,
            searchFilters.sort,
            pageSize,
            signal
          );
        } else {
          const filters = {
            genre: searchFilters.genre,
            language: searchFilters.language,
            country: searchFilters.country,
            company: searchFilters.company,
            decade: searchFilters.decade,
            sort: searchFilters.sort,
            page: currentPage,
            page_size: pageSize,
          };

          res = await fetchFilteredFilms(filters, signal);
        }

        if (!res || typeof res !== "object" || !Array.isArray(res.results)) {
          throw new Error("Invalid film data received.");
        }

        setFilms(res.results);
        setTotalPages(Math.ceil((res.count || 0) / pageSize));
      } catch (err) {
        if (err?.code !== "ERR_CANCELED") console.error(err);
        setFilms([]);
      } finally {
        setLoading(false);
      }
    },
    [personId, searchFilters, currentPage, pageSize]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchFilms(controller.signal);
    return () => controller.abort();
  }, [fetchFilms]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleRoleChange = (role) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("role", role);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleSortChange = (sortValue) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", sortValue);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const roleOptions = Array.isArray(roles)
    ? roles.map((r) =>
        typeof r === "string"
          ? { label: r, value: r }
          : { label: `${r.role} (${r.count})`, value: r.role }
      )
    : [];

  const paginationPages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((page) => {
        return (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 2 && page <= currentPage + 2)
        );
      })
      .reduce((acc, page, i, arr) => {
        if (i > 0 && page - arr[i - 1] > 1) acc.push("...");
        acc.push(page);
        return acc;
      }, []);
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6">
      {(showRoleDropdown || filters.length > 0 || sortOptions.length > 0) && (
        <div className="w-full flex justify-between items-center mb-4 flex-wrap gap-4">
          {showRoleDropdown && (
            <DropdownSelector
              label="Role"
              value={searchFilters.role}
              options={roleOptions}
              onChange={handleRoleChange}
            />
          )}
          <FilterSortBar
            filters={filters}
            sortOptions={sortOptions}
            onSortChange={handleSortChange}
          />
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : films?.length ? (
        <>
          <div
            className={`grid gap-6 justify-center ${gridClassMap[cardSize]}`}
          >
            {films.map((film) => (
              <FilmCard
                key={film.id}
                id={film.id}
                title={film.title}
                year={film.year}
                posterUrl={film.posterUrl}
                backdropUrl={film.backdropUrl}
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

              {paginationPages.map((page, i) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-3 py-1 text-gray-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={page === currentPage ? "primary" : "secondary"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

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
  personId: PropTypes.string,
  cardSize: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  filters: PropTypes.array,
  sortOptions: PropTypes.array,
  showRoleDropdown: PropTypes.bool,
  roles: PropTypes.array,
  defaultSort: PropTypes.string,
};
