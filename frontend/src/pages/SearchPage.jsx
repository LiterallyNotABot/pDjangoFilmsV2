import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useSearchBox from "../hooks/useSearchBox";
import SearchResultsFeed from "../features/search/SearchResultsFeed";

export default function SearchPage() {
  const { search, results, loading, error } = useSearchBox();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q")?.trim() || "";

  useEffect(() => {
    if (query.length >= 2) {
      search(query);
    }
  }, [query]);

  const isEmpty =
    !loading &&
    results &&
    Object.values(results).every((arr) => Array.isArray(arr) && arr.length === 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl text-white font-semibold mb-4">
        Results for: <span className="text-red-400">"{query}"</span>
      </h1>

      {loading && <p className="text-zinc-400">Searching...</p>}
      {error && <p className="text-red-400">An error occurred: {error.message}</p>}
      {isEmpty && <p className="text-zinc-500">No results found.</p>}

      {!loading && results && <SearchResultsFeed results={results} />}
    </div>
  );
}
