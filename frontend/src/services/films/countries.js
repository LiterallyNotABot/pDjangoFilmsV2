import { fetchData } from "../requestHandler";

export const getAllCountries = (signal = null) =>
  fetchData("/countries/", { signal });