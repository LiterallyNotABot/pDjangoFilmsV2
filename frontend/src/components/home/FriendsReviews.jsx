import "./css/FriendsReviews.css";

export default function FriendsReviews({ reviews = [] }) {
  return (
    <section className="px-4 mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">Reseñas de tus amigos</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="friend-review-card">
            <div className="friend-review-poster">
              <img
                src={review.posterUrl}
                alt={review.filmTitle}
                className="poster"
              />
            </div>

            <div className="friend-review-content">
              <h3 className="film-title">{review.filmTitle}</h3>
              <div className="meta">
                <span className="author">{review.author}</span>
                <span className="date">{review.date}</span>
              </div>
              {review.rating && (
                <div className="rating">
                  {"★".repeat(Math.floor(review.rating))}
                  {review.rating % 1 ? "½" : ""}
                </div>
              )}
              <p className="excerpt">{review.text}</p>
              <span className="likes">❤️ {review.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
