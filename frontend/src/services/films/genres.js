import { fetchData } from "../requestHandler";
export const fetchGenres = async (signal = null) => {
  const response = await fetchData("/films/genres/", { signal });
  return response.results || []; 
};

export const fetchGenreById = (id, signal) =>
  fetchData(`/films/genres/${id}/`, { signal });
