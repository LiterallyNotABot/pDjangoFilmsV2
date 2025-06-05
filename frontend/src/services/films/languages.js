import { fetchData } from "../requestHandler";

export const getAllLanguages = (signal = null) =>
  fetchData("/languages/", { signal });