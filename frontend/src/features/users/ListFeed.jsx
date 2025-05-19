import PropTypes from "prop-types";
import ListCard from "./ListCard";
import "./css/ListFeed.css";

export default function ListFeed({ title="Popular Lists", lists }) {
  return (
    <section className="list-feed-section">
      <h2 className="list-feed-title">{title}</h2>

      <div className="list-feed-list">
        {lists.map((list, i) => (
          <div key={i}>
            <ListCard list={list} />
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
