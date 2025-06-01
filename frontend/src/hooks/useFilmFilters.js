import { useSearchParams, useParams } from "react-router-dom";
import { useMemo } from "react";

export default function useFilmFilters(defaults = {}) {
  const [searchParams] = useSearchParams();
  const { id: personId } = useParams(); // clave desde el path

  return useMemo(() => ({
    personId, // del path
    role: searchParams.get("role") || defaults.role || "Actor",
    genre: searchParams.get("genre") || defaults.genre || null,
    language: searchParams.get("language") || defaults.language || null,
    sort: searchParams.get("sort") || defaults.sort || null,
    page: searchParams.get("page") || defaults.page || 1,
  }), [searchParams, personId, defaults]);
}