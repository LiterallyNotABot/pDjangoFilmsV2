import { fetchData } from "../requestHandler";

export const getAllLanguages = (signal = null) =>
  fetchData("/films/languages/", { signal });

export const fetchLanguageById = (id, signal) =>
  fetchData(`/films/languages/${id}/`, { signal });