import { fetchData, postData } from "../requestHandler";

export const getPopularReviews = async (limit = 10, signal = null) => {
  return fetchData("/reviews/popular/", { params: { limit }, signal });
};

export const getFriendsReviews = async (limit = 10, signal = null) => {
  return fetchData("/reviews/friends/", { params: { limit }, signal });
};

export const toggleReviewLike = async (reviewId, signal = null) => {
  return postData(`/reviews/${reviewId}/like-toggle/`, {}, { signal });
};
