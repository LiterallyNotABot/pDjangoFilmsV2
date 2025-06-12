import { fetchData } from "../requestHandler";

export const fetchLanguageById = (id, signal) =>
  fetchData(`/films/languages/${id}/`, { signal });