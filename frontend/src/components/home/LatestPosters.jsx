import PropTypes from "prop-types";
import HorizontalGrid from "../ui/HorizontalGrid";
import FilmCard from "../../features/films/FilmCard";
import useUserStore from "../../store/user/userStore";

export default function LatestPosters({
  films = [],
  isFriendsActivity = false,
}) {
  const { user } = useUserStore();

  return (
    <HorizontalGrid
      title={isFriendsActivity ? "Friends Activity" : "Last Releases"}
      items={films}
      renderItem={(film) => (
        <FilmCard
          key={film.id}
          id={film.id}
          title={film.title}
          year={film.year}
          posterUrl={film.posterUrl}
          size="md"
          user={film.user || null}
          showUserActions={!!user}
          showUserTag={!!film.user} // ✅ MOSTRAR FOOTER SI activity
        />
      )}
    />
  );
}
