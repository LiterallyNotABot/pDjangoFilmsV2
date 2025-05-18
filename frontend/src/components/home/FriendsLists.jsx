import "./css/FriendsLists.css";

export default function FriendsLists({ lists = [] }) {
  return (
    <section className="px-4 mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">Listas recientes de tus amigos</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {lists.map((list, idx) => (
          <div key={idx} className="friend-list-card">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="list-title">{list.title}</h3>
              <span className="list-likes">❤️ {list.likes}</span>
            </div>
            <p className="list-meta mb-2">
              por <span className="list-author">{list.user}</span>
            </p>
            <div className="list-posters">
              {list.films.slice(0, 4).map((film, i) => (
                <img
                  key={i}
                  src={film.posterUrl}
                  alt={film.title}
                  className="poster"
                />
              ))}
            </div>
            <p className="list-updated">{list.updated}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
