import HorizontalGrid from "../ui/HorizontalGrid";
import FilmCard from "../../features/films/FilmCard";

export default function LatestPosters({ films = [] }) {
  return (
    <HorizontalGrid
      title="Last Releases"
      items={films}
      renderItem={(film) => (
        <FilmCard
          key={film.id}
          id={film.id}
          title={film.title}
          year={film.year}
          posterUrl={film.posterUrl}
          size="md"
          showUserActions={false}
        />
      )}
    />
  );
}
