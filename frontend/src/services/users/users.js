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

export const getUserFilmActivities = (filmIds = [], signal = null) => {
  return postData(`/users/film-activities/`, { film_ids: filmIds }, { signal });
};