import PropTypes from "prop-types";
import FilmCard from "../films/FilmCard";
import HeartIcon from "../../components/ui/icons/HeartIcon";
import UserBadge from "@/features/users/UserBadge";
import "./css/ListCard.css";
import useUserStore from "@/store/user/userStore";

function ListCard({
  list,
  activityMap = {},
  onToggleLiked,
  onToggleWatched,
  onToggleListLiked,
}) {
  const { user } = useUserStore();

  const userData =
    typeof list.user === "string"
      ? { username: list.user, avatarUrl: null }
      : list.user;

  return (
    <div className="poster-container overflow-visible">
      <div className="list-card">
        <div className="list-posters">
          {list.films.slice(0, 5).map((film, idx) => (
            <div
              key={film.id}
              className="poster-wrapper"
              style={{ zIndex: 5 - idx }}
            >
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

        <div className="list-meta flex justify-between items-center">
          <UserBadge user={userData} size="sm" />

          <button
            className="group flex items-center gap-1 text-xs transition"
            disabled={!user}
            onClick={() => onToggleListLiked?.(list.id)}
          >
            <HeartIcon
              size="sm"
              active={list.likedByUser}
              className={`transition ${
                list.likedByUser
                  ? "text-yellow-400"
                  : user
                  ? "text-zinc-400 group-hover:text-yellow-400"
                  : "text-zinc-400"
              }`}
            />
            {list.likes}
          </button>
        </div>
      </div>
    </div>
  );
}

ListCard.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      }),
    ]).isRequired,
    films: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        posterUrl: PropTypes.string,
        year: PropTypes.number,
      })
    ).isRequired,
    likes: PropTypes.number,
    likedByUser: PropTypes.bool,
  }).isRequired,
  activityMap: PropTypes.object,
  onToggleLiked: PropTypes.func,
  onToggleWatched: PropTypes.func,
  onToggleListLiked: PropTypes.func,
};

export default ListCard;
