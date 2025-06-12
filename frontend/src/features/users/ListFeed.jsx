import PropTypes from "prop-types";
import ListCard from "./ListCard";
import "./css/ListFeed.css";
import { memo, useMemo } from "react";
import useBatchFilmActivity from "@/hooks/useBatchFilmActivity";
import useUserFilmToggle from "@/hooks/useUserFilmToggle";

function ListFeed({ title = "Popular Lists", lists }) {
  const filmIds = useMemo(() => {
    const ids = [];
    lists.forEach((list) => {
      list.films?.forEach((f) => typeof f.id === "number" && ids.push(f.id));
    });
    return [...new Set(ids)];
  }, [lists]);

  const { activityMap, setActivityForFilm } = useBatchFilmActivity(filmIds);
  const handleToggle = useUserFilmToggle(activityMap, setActivityForFilm);

  const renderedLists = useMemo(
    () =>
      lists.map((list, i) => (
        <div key={list.id || i}>
          <ListCard
            list={list}
            activityMap={activityMap}
            onToggleLiked={handleToggle}
            onToggleWatched={handleToggle}
          />
          {i < lists.length - 1 && <hr className="list-divider" />}
        </div>
      )),
    [lists, activityMap, handleToggle]
  );

  return (
    <section className="list-feed-section">
      <h2 className="list-feed-title">{title}</h2>
      <div className="list-feed-list">{renderedLists}</div>
    </section>
  );
}

ListFeed.propTypes = {
  title: PropTypes.string,
  lists: PropTypes.array.isRequired,
};

export default memo(ListFeed);
