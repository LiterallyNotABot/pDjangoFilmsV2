import axios from "../axios";

export const getFilmById = async (id) => {
  const res = await axios.get(`/films/${id}/`);
  return res.data;
};

export const getAllFilms = async () => {
  const res = await axios.get("/films/");
  return res.data;
};

export const getLatestFilms = async (limit = 10) => {
  const res = await axios.get(`/films/latest/?limit=${limit}`);
  return res.data;
};

export const getFriendsActivityFilms = async (limit = 10) => {
  const res = await axios.get(`/films/friends-activity/?limit=${limit}`);
  return res.data;
};
