import PropTypes from "prop-types";
import FilmCard from "../films/FilmCard";
import HeartIcon from "../../components/ui/icons/HeartIcon";
import "./css/ListCard.css";
import useUserStore from "@/store/user/userStore";

function ListCard({ list, activityMap = {}, onToggleLiked, onToggleWatched }) {
  const { user } = useUserStore();

  return (
    <div className="poster-container overflow-visible">
      <div className="list-card">
        <div className="list-posters">
          {list.films.slice(0, 5).map((film, idx) => (
            <div key={film.id} className="poster-wrapper" style={{ zIndex: 5 - idx }}>
              <FilmCard
                id={film.id}
                title={film.title}
                posterUrl={film.posterUrl}
                year={film.year}
                size="sm"
                showUserActions={true}
                user={user}
                activity={activityMap[film.id] || {}}
                onToggleLiked={() => onToggleLiked(film.id)}
                onToggleWatched={() => onToggleWatched(film.id)}
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
        year: PropTypes.number,
      })
    ).isRequired,
    likes: PropTypes.number,
  }).isRequired,
  activityMap: PropTypes.object,
  onToggleLiked: PropTypes.func,
  onToggleWatched: PropTypes.func,
};

export default ListCard;
