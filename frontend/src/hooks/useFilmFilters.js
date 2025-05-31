import { useSearchParams, useParams } from "react-router-dom";

export default function useFilmFilters(defaults = {}) {
  const [searchParams] = useSearchParams();
  const { id: personId } = useParams(); // <<--- esto es clave

  return {
    personId, // del path, no del query
    role: searchParams.get("role") || defaults.role || "Actor",
    genre: searchParams.get("genre") || defaults.genre || null,
    language: searchParams.get("language") || defaults.language || null,
    sort: searchParams.get("sort") || defaults.sort || null,
    page: searchParams.get("page") || defaults.page || 1,
  };
}
