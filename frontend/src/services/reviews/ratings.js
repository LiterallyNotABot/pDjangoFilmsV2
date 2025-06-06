import { fetchData } from "../requestHandler";

export const getRatingStats = (filmId, signal) =>
  fetchData(`/reviews/films/${filmId}/rating-stats/`, { signal });