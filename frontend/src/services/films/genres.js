// services/films/genres.js
import { fetchData } from "../requestHandler";

export const fetchGenres = (signal = null) =>
  fetchData("/genres/", { signal });
