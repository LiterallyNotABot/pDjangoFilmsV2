import axios from "../axios";

export const getPopularReviews = async (limit = 10) => {
  const response = await axios.get(`/reviews/popular/?limit=${limit}`);
  return response.data;
};

export const getFriendsReviews = async (limit = 10) => {
  const response = await axios.get(`/reviews/friends/?limit=${limit}`);
  return response.data;
};

