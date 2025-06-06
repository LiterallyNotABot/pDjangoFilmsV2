import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilmGrid from "../features/films/FilmGrid";
import { fetchGenres, fetchGenreById } from "../services/films/genres";
import { fetchCompanyById } from "../services/films/companies";
import { fetchLanguageById } from "../services/films/languages";
import { fetchCountryById } from "../services/films/countries";

export default function FilmGridPage() {
  const [searchParams] = useSearchParams();
  const [genreOptions, setGenreOptions] = useState([]);
  const [contextLabel, setContextLabel] = useState("All Films");

  const genreId = searchParams.get("genre");
  const companyId = searchParams.get("company");
  const languageId = searchParams.get("language");
  const countryId = searchParams.get("country");

  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const genres = await fetchGenres();
        const options = genres.map((g) => ({
          value: g.genre_id.toString(),
          label: g.genre_name,
        }));
        setGenreOptions([{ value: "", label: "All Genres" }, ...options]);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setGenreOptions([{ value: "", label: "All Genres" }]);
      }
    };
    fetchAllGenres();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchContextName = async () => {
      try {
        if (genreId) {
          const g = await fetchGenreById(genreId, controller.signal);
          setContextLabel(g?.genre_name ?? "Genre");
        } else if (companyId) {
          const c = await fetchCompanyById(companyId, controller.signal);
          setContextLabel(c?.name ?? "Company");
        } else if (languageId) {
          const l = await fetchLanguageById(languageId, controller.signal);
          setContextLabel(l?.language_name ?? "Language");
        } else if (countryId) {
          const c = await fetchCountryById(countryId, controller.signal);
          setContextLabel(c?.country_name ?? "Country");
        } else {
          setContextLabel("All Films");
        }
      } catch (err) {
        console.warn("Could not fetch context label:", err);
        setContextLabel("All Films");
      }
    };

    fetchContextName();
    return () => controller.abort();
  }, [genreId, companyId, languageId, countryId]);

  const filters = [
    {
      key: "genre",
      options: genreOptions,
    },
    {
      key: "decade",
      options: [
        { value: "", label: "All Decades" },
        { value: "2020", label: "2020s" },
        { value: "2010", label: "2010s" },
        { value: "2000", label: "2000s" },
        { value: "1990", label: "1990s" },
        { value: "1980", label: "1980s" },
        { value: "1970", label: "1970s" },
        { value: "1960", label: "1960s" },
        { value: "1950", label: "1950s" },
        { value: "1940", label: "1940" },
        { value: "1930", label: "1930" },
        { value: "1920", label: "1920" },
        { value: "1910", label: "1910" },
      ],
    },
  ];

  const sortOptions = [
    { label: "Popularity", value: "popularity" },
    { label: "Newest First", value: "releaseDate_desc" },
    { label: "Oldest First", value: "releaseDate_asc" },
    { label: "Highest Rated", value: "userRating_desc" },
    { label: "Lowest Rated", value: "userRating_asc" },
    { label: "Shortest", value: "filmLength_asc" },
    { label: "Longest", value: "filmLength_desc" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500">{contextLabel}</h1>
      </div>

      <FilmGrid
        personId={null}
        cardSize="sm"
        filters={filters}
        sortOptions={sortOptions}
        defaultSort="popularity"
      />
    </div>
  );
}
