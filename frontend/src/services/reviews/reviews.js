import api from "../axios";
import { handleApiError } from "../exceptionHelper";

export const getPopularReviews = async (limit = 10, signal = null) => {
  try {
    const response = await api.get(`/reviews/popular/?limit=${limit}`, { signal });
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getFriendsReviews = async (limit = 10, signal = null) => {
  try {
    const response = await api.get(`/reviews/friends/?limit=${limit}`, { signal });
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
