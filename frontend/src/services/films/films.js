import { fetchData } from "../requestHandler";

export const getFilmById = (id, signal) =>
  fetchData(`/films/${id}/`, { signal });

export const getAllFilms = (signal) =>
  fetchData("/films/", { signal });

export const getLatestFilms = (limit = 10, signal) =>
  fetchData("/films/latest/", { params: { limit }, signal });

export const fetchFilmsByFilter = (filters, signal) =>
  fetchData("/films/", { params: filters, signal });
