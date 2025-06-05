import { fetchData } from "../requestHandler";

export const getFriendsActivityFilms = (limit = 10, signal) =>
  fetchData("/activity/friends/", { params: { limit }, signal });
