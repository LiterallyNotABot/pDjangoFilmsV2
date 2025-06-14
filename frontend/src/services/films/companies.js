import { fetchData } from "../requestHandler";

export const fetchCompanyById = (id, signal) =>
  fetchData(`/films/companies/${id}/`, { signal });