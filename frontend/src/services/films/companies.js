import { fetchData } from "../requestHandler";

export const getFilmsByCompany = (signal = null) =>
  fetchData("/countries/", { signal });

export const fetchCompanyById = (id, signal) =>
  fetchData(`/films/companies/${id}/`, { signal });