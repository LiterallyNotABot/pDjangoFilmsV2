import api from "../axios";
import { handleApiError } from "../errorHelper";

export const getFilmById = async (id) => {
  try {
    const res = await api.get(`/films/${id}/`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getAllFilms = async () => {
  try {
    const res = await api.get("/films/");
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getLatestFilms = async (limit = 10) => {
  try {
    const res = await api.get(`/films/latest/?limit=${limit}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const fetchFilmsByFilter = async (filters) => {
  try {
    const res = await api.get("/films/", { params: filters });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
