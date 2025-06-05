import PropTypes from "prop-types";
import ListCard from "./ListCard";
import "./css/ListFeed.css";
import { memo, useMemo } from "react";

function ListFeed({ title = "Popular Lists", lists }) {
  const renderedLists = useMemo(() => (
    lists.map((list, i) => (
      <div key={list.id || i}>
        <ListCard list={list} />
        {i < lists.length - 1 && <hr className="list-divider" />}
      </div>
    ))
  ), [lists]);

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
