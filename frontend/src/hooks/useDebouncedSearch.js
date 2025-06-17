import { useEffect, useState } from "react";

export default function useDebouncedSearch(searchFn, delay = 400) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await searchFn(query, { signal });
        if (data) {
          setResults(data);
        }
      } catch (err) {
        setError(err?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [query, delay, searchFn]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
}
