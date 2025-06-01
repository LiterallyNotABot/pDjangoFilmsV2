import { fetchData } from "../requestHandler";

export const getPopularLists = (limit = 10, signal) =>
  fetchData("/users/lists/popular/", { params: { limit }, signal });

export const getFriendsLists = (limit = 6, signal) =>
  fetchData("/users/lists/friends/", { params: { limit }, signal });
