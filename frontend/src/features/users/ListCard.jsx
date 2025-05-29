import PropTypes from "prop-types";
import FilmCard from "../films/FilmCard";
import HeartIcon from "../../components/ui/icons/HeartIcon";
import "./css/ListCard.css";

export default function ListCard({ list }) {
  return (
    <div className="poster-container overflow-visible">
      <div className="list-card">
        <div className="list-posters">
          {list.films.slice(0, 5).map((film, idx) => (
            <div
              key={idx}
              className="poster-wrapper"
              style={{ zIndex: 5 - idx }}
            >
              <FilmCard
                id={film.id}
                title={film.title}
                posterUrl={film.posterUrl}
                year={film.year}
                size="sm"
                showUserActions={false}
              />
            </div>
          ))}
        </div>

        <h3 className="list-title truncate">{list.name}</h3>

        <div className="list-meta">
          <span className="user">@{list.user}</span>
          <span className="flex items-center gap-1 text-green-500">
            <HeartIcon active size="sm" /> {list.likes}
          </span>
        </div>
      </div>
    </div>
  );
}

ListCard.propTypes = {
  list: PropTypes.shape({
    name: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    films: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        posterUrl: PropTypes.string,
      })
    ).isRequired,
    likes: PropTypes.number,
  }).isRequired,
};
