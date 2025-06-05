import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilmGrid from "../features/films/FilmGrid";
import { fetchGenres } from "../services/films/genres";

export default function FilmGridPage() {
  const [searchParams] = useSearchParams();
  const [genreOptions, setGenreOptions] = useState([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const genres = await fetchGenres();
        const options = genres.map((g) => ({
          value: g.genre_id.toString(),
          label: g.genre_name,
        }));
        setGenreOptions(options);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  const filters = [
    {
      key: "genre",
      options: genreOptions,
    },
  ];

  const sortOptions = [
    { label: "Most Popular", value: "popularity" },
    { label: "Highest Rated", value: "rating" },
    { label: "Newest", value: "release_date" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Films</h1>
      </div>

      <FilmGrid
        personId={null}
        cardSize="sm"
        filters={filters}
        sortOptions={sortOptions}
      />
    </div>
  );
}
