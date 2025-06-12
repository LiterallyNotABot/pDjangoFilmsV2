import PropTypes from "prop-types";
import ListCard from "./ListCard";
import "./css/ListFeed.css";
import { useMemo } from "react";
import useBatchFilmActivity from "@/hooks/useBatchFilmActivity";
import useUserFilmToggle from "@/hooks/useUserFilmToggle";

export default function ListFeed({ title = "Popular Lists", lists }) {
  const filmIds = useMemo(() => {
    const ids = [];
    lists.forEach((list) => {
      list.films?.forEach((f) => typeof f.id === "number" && ids.push(f.id));
    });
    return [...new Set(ids)];
  }, [lists]);

  const { activityMap: rawActivityMap, setActivityForFilm } = useBatchFilmActivity(filmIds);
  const handleToggle = useUserFilmToggle(rawActivityMap, setActivityForFilm);

  // Para evitar problemas de re-render, forzamos nueva referencia
  const activityMap = useMemo(() => ({ ...rawActivityMap }), [rawActivityMap]);

  return (
    <section className="list-feed-section">
      <h2 className="list-feed-title">{title}</h2>
      <div className="list-feed-list">
        {lists.map((list, i) => (
          <div key={list.id || i}>
            <ListCard
              list={list}
              activityMap={activityMap}
              onToggleLiked={(id) => handleToggle(id, "liked")}
              onToggleWatched={(id) => handleToggle(id, "watched")}
            />
            {i < lists.length - 1 && <hr className="list-divider" />}
          </div>
        ))}
      </div>
    </section>
  );
}

ListFeed.propTypes = {
  title: PropTypes.string,
  lists: PropTypes.array.isRequired,
};
