import api from "../axios";
import { handleApiError } from "../errorHelper";

export const getPopularLists = async (limit = 10) => {
  try {
    const response = await api.get(`/users/lists/popular/?limit=${limit}`);
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getFriendsLists = async (limit = 6) => {
  try {
    const response = await api.get(`/users/lists/friends/?limit=${limit}`);
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
