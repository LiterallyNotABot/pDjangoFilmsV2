import api from "../axios";
import { handleApiError } from "../errorHelper";
export const getPopularReviews = async (limit = 10) => {
  try {
    const response = await api.get(`/reviews/popular/?limit=${limit}`);
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getFriendsReviews = async (limit = 10) => {
  try {
    const response = await api.get(`/reviews/friends/?limit=${limit}`);
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
