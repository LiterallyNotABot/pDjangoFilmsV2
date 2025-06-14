import PropTypes from "prop-types";
import { memo, useCallback, useMemo } from "react";
import HorizontalGrid from "../ui/HorizontalGrid";
import FilmCard from "../../features/films/FilmCard";
import useUserStore from "../../store/user/userStore";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import useUserFilmToggle from "@/hooks/useUserFilmToggle";

function LatestPosters({ films = [], isFriendsActivity = false }) {
  const { user } = useUserStore();
  const { activityByFilmId, setActivity } = useFilmActivityStore();

  const handleToggle = useUserFilmToggle(activityByFilmId, setActivity);

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
        activity={activityByFilmId[film.id]}
        onToggleLiked={() => handleToggle(film.id, "liked")}
        onToggleWatched={() => handleToggle(film.id, "watched")}
      />
    ),
    [user, activityByFilmId, handleToggle]
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
