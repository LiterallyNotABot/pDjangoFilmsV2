import { useSearchParams, useParams } from "react-router-dom";

export default function useFilmFilters(defaults = {}) {
  const [searchParams] = useSearchParams();
  const { id: personId } = useParams();

  const query = Object.fromEntries(searchParams.entries());

  return {
    personId,
    role: query.role || defaults.role || "Actor",
    genre: query.genre || defaults.genre || null,
    language: query.language || defaults.language || null,
    country: query.country || defaults.country || null,
    company: query.company || defaults.company || null,
    decade: query.decade || defaults.decade || null, // ✅ AGREGALO ACÁ TAMBIÉN
    sort: query.sort || defaults.sort || null,
  };
}
