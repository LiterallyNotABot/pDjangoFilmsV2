import api from "../axios";
import { handleApiError } from "../errorHelper";
export const getFriendsActivityFilms = async (limit = 10) => {
  try {
    const res = await api.get("/activity/friends/", { params: { limit } });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
