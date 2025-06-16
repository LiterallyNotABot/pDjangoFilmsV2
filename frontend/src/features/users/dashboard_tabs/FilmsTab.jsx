import React, { useMemo, useState, useCallback } from "react";
import FilmGrid from "@/features/films/FilmGrid";
import useUserStore from "@/store/user/userStore";
import useBatchFilmActivity from "@/hooks/useBatchFilmActivity";

export default function FilmsTab({ username }) {
  const { user } = useUserStore();
  const [filmIds, setFilmIds] = useState([]);
  const { activityMap, setActivityForFilm } = useBatchFilmActivity(filmIds);

  const filters = [];

  const sortOptions = useMemo(() => [
    { label: "Popularity", value: "popularity" },
    { label: "Newest First", value: "releaseDate_desc" },
    { label: "Oldest First", value: "releaseDate_asc" },
    { label: "Highest Rated", value: "userRating_desc" },
    { label: "Lowest Rated", value: "userRating_asc" },
  ], []);

  const onFilmsChange = useCallback((films) => {
    const ids = films.map((film) => film.id);
    setFilmIds(ids);
  }, []);

  const handleToggleLiked = useCallback(
    (filmId) => {
      const currentLiked = activityMap[filmId]?.liked || false;
      setActivityForFilm(filmId, { liked: !currentLiked });
    },
    [activityMap, setActivityForFilm]
  );

  const handleToggleWatched = useCallback(
    (filmId) => {
      const currentWatched = activityMap[filmId]?.watched || false;
      setActivityForFilm(filmId, { watched: !currentWatched });
    },
    [activityMap, setActivityForFilm]
  );

  return (
    <div className="max-w-full">
      <FilmGrid
        username={username} 
        filters={filters}
        cardSize="sm"
        showRoleDropdown={false}
        onFilmsChange={onFilmsChange}
        activityMap={activityMap}
        onToggleLiked={handleToggleLiked}
        onToggleWatched={handleToggleWatched}
        user={user}
        sortOptions={sortOptions}
        defaultSort="popularity"
      />
    </div>
  );
}
