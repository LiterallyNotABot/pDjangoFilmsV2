import { fetchData, patchData, postData, deleteData } from "../requestHandler";
import { handleApiError } from "@/services/exceptionHelper";

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

export const deleteWatchlistEntry = async (filmId, signal = null) => {
  try {
    return await deleteData(`/users/film-activity/${filmId}/watchlist/`, { signal });
  } catch (err) {
    if (err?.status === 404) {
      console.info("Watchlist entry not found — skipping.");
      return null;
    }

    throw err;
  }
};


export async function getUserFilmActivityBatch(filmIds) {
  return await postData("/activity/user-film-activity/batch/", {
    film_ids: filmIds,
  });
}


export const getUserProfile = (username) =>
  fetchData(`/users/${username}/profile/`);

export const getUserFavorites = (username) =>
  fetchData(`/users/${username}/favorites/`);

export const getUserActivity = (username) =>
  fetchData(`/users/${username}/activity/`);

export const getUserReviews = async (username) => {
  const response = await fetchData(`/users/${username}/reviews/`);
  return Array.isArray(response) ? response : response?.results || [];
};

export const getUserStats = (username) =>
  fetchData(`/users/${username}/stats/`);

export const getUserDashboard = (username) =>
  fetchData(`/users/${username}/dashboard/`);

export const getUserFilms = (username, page = 1, page_size = 72, signal = null) => {
  return fetchData(`/users/${username}/films/`, {
    params: { page, page_size }, signal, });
};

export const getUserWatchlist = (username, page = 1, page_size = 20, signal = null) => {
  return fetchData(`/users/${username}/watchlist/films/`, {
    params: { page, page_size },
    signal,
  });
};

export const getUserDiary = async (username) => {
  return fetchData(`/users/${username}/diary/`);
};