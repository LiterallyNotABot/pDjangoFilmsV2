import FilmCard from "../films/FilmCard";
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
                size="sm"
                showUserActions={false}
              />
            </div>
          ))}
        </div>

        <h3 className="list-title">{list.title}</h3>

        <div className="list-meta">
          <span className="user">@{list.user}</span>
          <span className="likes">❤️ {list.likes}</span>
          <span className="comments">💬 {list.comments || 0}</span>
        </div>
      </div>
    </div>
  );
}
