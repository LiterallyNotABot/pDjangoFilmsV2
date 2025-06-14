import PropTypes from "prop-types";
import ReviewCard from "./ReviewCard";
import "./css/ReviewFeed.css";
import { memo, useEffect, useState } from "react";
import useUserFilmToggle from "@/hooks/useUserFilmToggle";
import useUserStore from "@/store/user/userStore";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";
import { toggleReviewLike } from "@/services/reviews/reviews";

function ReviewFeed({ title = "Popular Reviews", reviews, activityReady }) {
  const { user } = useUserStore();
  const { activityByFilmId, setActivity } = useFilmActivityStore();
  const [likeState, setLikeState] = useState({});

  const handleToggle = useUserFilmToggle(activityByFilmId, setActivity);

  useEffect(() => {
    const map = Object.fromEntries(
      reviews.map((r) => [
        r.review_id,
        {
          likedByUser: !!r.likedByUser,
          likesCount: r.likes || 0,
          loading: false,
        },
      ])
    );
    setLikeState(map);
  }, [reviews]);

  const handleToggleReviewLike = async (reviewId) => {
    if (!user || !likeState[reviewId]) return;

    const current = likeState[reviewId];

    setLikeState((prev) => ({
      ...prev,
      [reviewId]: { ...current, loading: true },
    }));

    try {
      await toggleReviewLike(reviewId);

      const updated = {
        likedByUser: !current.likedByUser,
        likesCount: current.likedByUser
          ? current.likesCount - 1
          : current.likesCount + 1,
        loading: false,
      };

      setLikeState((prev) => ({
        ...prev,
        [reviewId]: updated,
      }));
    } catch (err) {
      console.error("Error toggling like on review", err);
      setLikeState((prev) => ({
        ...prev,
        [reviewId]: { ...current, loading: false },
      }));
    }
  };

  if (!activityReady) return null;

  return (
    <section className="review-feed-section">
      <h2 className="review-feed-title">{title}</h2>
      <div className="space-y-6">
        {reviews.map((review) => {
          const likeInfo = likeState[review.review_id] || {};
          return (
            <ReviewCard
              key={review.review_id}
              review={review}
              activityMap={activityByFilmId}
              likedByUser={likeInfo.likedByUser}
              likesCount={likeInfo.likesCount}
              likeLoading={likeInfo.loading}
              onToggleLikedReview={() =>
                handleToggleReviewLike(review.review_id)
              }
              onToggleFilmLiked={() =>
                handleToggle(review.film?.id, "liked")
              }
              onToggleWatched={() =>
                handleToggle(review.film?.id, "watched")
              }
            />
          );
        })}
      </div>
    </section>
  );
}

ReviewFeed.propTypes = {
  title: PropTypes.string,
  reviews: PropTypes.array.isRequired,
  activityReady: PropTypes.bool.isRequired,
};

export default memo(ReviewFeed);
