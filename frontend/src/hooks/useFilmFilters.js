import { useSearchParams } from "react-router-dom";

export default function useFilmFilters(defaults = {}) {
  const [searchParams] = useSearchParams();

  const filters = { ...defaults };
  for (const [key, value] of searchParams.entries()) {
    filters[key] = value;
  }

  return filters;
}
