import PropTypes from "prop-types";
import { memo, useCallback, useMemo } from "react";
import HorizontalGrid from "../ui/HorizontalGrid";
import FilmCard from "../../features/films/FilmCard";
import useUserStore from "../../store/user/userStore";
import useBulkFilmActivities from "@/hooks/useBulkFilmActivities";

function LatestPosters({ films = [], isFriendsActivity = false }) {
  const { user } = useUserStore();
  useBulkFilmActivities(useMemo(() => films.map((f) => f.id), [films]));

  const renderItem = useCallback(
    (film) => (
      <FilmCard
        key={film.id}
        id={film.id}
        title={film.title}
        year={film.year}
        posterUrl={film.posterUrl}
        size="md"
        user={film.user || null}
        showUserActions={!!user}
        showUserTag={!!film.user}
      />
    ),
    [user]
  );

  return (
    <HorizontalGrid
      title={isFriendsActivity ? "Friends Activity" : "Latest Releases"}
      items={films}
      renderItem={renderItem}
    />
  );
}

LatestPosters.propTypes = {
  films: PropTypes.array.isRequired,
  isFriendsActivity: PropTypes.bool,
};

export default memo(LatestPosters);
