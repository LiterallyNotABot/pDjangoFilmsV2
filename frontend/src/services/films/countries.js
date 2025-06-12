import { fetchData } from "../requestHandler";

export const fetchCountryById = (id, signal) =>
  fetchData(`/films/countries/${id}/`, { signal });
