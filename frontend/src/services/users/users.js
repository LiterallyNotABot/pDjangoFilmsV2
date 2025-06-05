import { fetchData, patchData, postData, deleteData } from "../requestHandler";

export const loginUser = async (username, password) => {
  const { access, refresh } = await postData("/auth/jwt/create/", {
    username,
    password,
  });

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  const user = await fetchData("/users/me/");

  return {
    user,
    token: access,
  };
};

export const registerUser = async (username, email, password) => {
  return postData("/users/register/", {
    username,
    email,
    password,
  });
};

export const getUserFilmActivity = (filmId, signal = null) => {
  return fetchData(`/users/film-activity/${filmId}/`, { signal });
};

export const patchUserFilmActivity = (filmId, payload, signal = null) => {
  return patchData(`/users/film-activity/${filmId}/`, payload, { signal });
};

export const getWatchlistStatus = (filmId, signal = null) => {
  return fetchData(`/users/film-activity/${filmId}/watchlist/`, { signal });
};

export const postWatchlistEntry = (filmId, signal = null) => {
  return postData(`/users/film-activity/${filmId}/watchlist/`, {}, { signal });
};

export const deleteWatchlistEntry = (filmId, signal = null) => {
  return deleteData(`/users/film-activity/${filmId}/watchlist/`, { signal });
};