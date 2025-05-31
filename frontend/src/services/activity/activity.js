import axios from "../axios";

export const getFriendsActivityFilms = async (limit = 10) => {
  const res = await axios.get("/activity/friends/", { params: { limit } });
  return res.data;
};
