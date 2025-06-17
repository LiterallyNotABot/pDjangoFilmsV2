import { fetchData, postData, patchData, deleteData, } from "@/services/requestHandler";

export const getPopularLists = (limit = 10, signal) =>
  fetchData("/users/lists/popular/", { params: { limit }, signal });

export const getFriendsLists = (limit = 6, signal) =>
  fetchData("/users/lists/friends/", { params: { limit }, signal });

export const toggleListLike = (listId) =>
  postData(`/users/lists/${listId}/like-toggle/`);

export const getUserWatchlist = (username) =>
  fetchData(`/users/${username}/watchlist/`);

export const fetchUserLists = (username) =>
  fetchData(`/users/${username}/lists/`);

export const getListDetails = (username, id, options = {}) =>
  fetchData(`/users/${username}/lists/${id}/`, options);


export const createList = (username, payload, options = {}) =>
  postData(`/users/${username}/lists/`, payload, options);

export const updateList = (id, payload, options = {}) =>
  patchData(`/users/lists/${id}/`, payload, options);

export const deleteList = (id, options = {}) =>
  deleteData(`/users/lists/${id}/`, options);