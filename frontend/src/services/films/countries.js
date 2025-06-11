import { fetchData } from "../requestHandler";

export const getAllCountries = (signal = null) =>
  fetchData("/films/countries/", { signal });

export const fetchCountryById = (id, signal) =>
  fetchData(`/films/countries/${id}/`, { signal });
