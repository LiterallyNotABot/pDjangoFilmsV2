import "./css/PopularLists.css";

export default function PopularLists({ lists = [] }) {
  return (
    <section className="px-4 mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">Listas populares</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {lists.map((list, idx) => (
          <div key={idx} className="popular-list-card">
            <div className="mb-2 flex justify-between items-center">
              <h3 className="popular-list-title">{list.title}</h3>
              <span className="popular-list-likes">❤️ {list.likes}</span>
            </div>
            <p className="popular-list-meta mb-2">por <span className="popular-list-user">{list.user}</span></p>
            <div className="popular-list-grid">
              {list.films.slice(0, 4).map((film, i) => (
                <img
                  key={i}
                  src={film.posterUrl}
                  alt={film.title}
                  className="popular-list-poster"
                />
              ))}
            </div>
            <p className="popular-list-updated">{list.updated}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
