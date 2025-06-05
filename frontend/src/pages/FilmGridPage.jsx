import { useSearchParams } from "react-router-dom";
import FilmGrid from "../features/films/FilmGrid";

export default function FilmGridPage() {
  const [searchParams] = useSearchParams();

  const filters = [
    {
      key: "genre",
      options: [],
    },
    {
      key: "language",
      options: [],
    },
    {
      key: "company",
      options: [],
    },
    {
      key: "country",
      options: [],
    },
  ];

  const sortOptions = [
    { label: "Most Popular", value: "popularity" },
    { label: "Highest Rated", value: "rating" },
    { label: "Newest", value: "release_date" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl text-white font-bold mb-4">Films</h1>
      <FilmGrid
        personId={null}
        cardSize="sm"
        filters={filters}
        sortOptions={sortOptions}
      />
    </div>
  );
}
