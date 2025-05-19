import PropTypes from "prop-types";
import ReviewCard from "./ReviewCard";
import "./css/ReviewFeed.css";

export default function ReviewFeed({ title = "Popular Reviews", reviews }) {
  return (
    <section className="review-feed-section">
      <h2 className="review-feed-title">{title}</h2>
      <div className="space-y-6">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </section>
  );
}

ReviewFeed.propTypes = {
  title: PropTypes.string,
  reviews: PropTypes.array.isRequired,
};
