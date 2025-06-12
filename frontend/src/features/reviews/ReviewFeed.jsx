import PropTypes from "prop-types";
import ReviewCard from "./ReviewCard";
import "./css/ReviewFeed.css";
import { memo, useMemo } from "react";
import useBatchFilmActivity from "@/hooks/useBatchFilmActivity";
import useUserFilmToggle from "@/hooks/useUserFilmToggle";

function ReviewFeed({ title = "Popular Reviews", reviews }) {
  const filmIds = useMemo(
    () => reviews.map((r) => r.film?.id).filter((id) => typeof id === "number"),
    [reviews]
  );

  const { activityMap, setActivityForFilm } = useBatchFilmActivity(filmIds);
  const handleToggle = useUserFilmToggle(activityMap, setActivityForFilm);

  return (
    <section className="review-feed-section">
      <h2 className="review-feed-title">{title}</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard
            key={
              review.review_id ||
              `${review.user?.username || "anon"}-${review.film?.id || "noFilm"}`
            }
            review={review}
            activityMap={activityMap}
            onToggleLiked={() => handleToggle(review.film?.id, "liked")}
            onToggleWatched={() => handleToggle(review.film?.id, "watched")}
          />
        ))}
      </div>
    </section>
  );
}

ReviewFeed.propTypes = {
  title: PropTypes.string,
  reviews: PropTypes.array.isRequired,
};

export default memo(ReviewFeed);
