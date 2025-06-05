import PropTypes from "prop-types";
import ReviewCard from "./ReviewCard";
import "./css/ReviewFeed.css";
import { memo, useMemo } from "react";

function ReviewFeed({ title = "Popular Reviews", reviews }) {
  const content = useMemo(
    () =>
      reviews.map((review) => (
        <ReviewCard
          key={
            review.review_id ||
            `${review.user?.username || "anon"}-${review.film?.id || "noFilm"}`
          }
          review={review}
        />
      )),
    [reviews]
  );

  return (
    <section className="review-feed-section">
      <h2 className="review-feed-title">{title}</h2>
      <div className="space-y-6">{content}</div>
    </section>
  );
}

ReviewFeed.propTypes = {
  title: PropTypes.string,
  reviews: PropTypes.array.isRequired,
};

export default memo(ReviewFeed);
