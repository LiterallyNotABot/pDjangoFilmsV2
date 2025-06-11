import { useState } from "react";
import { searchAll } from "../services/search/search";

export default function useSearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (queryOverride) => {
    const query = (queryOverride ?? searchTerm).trim();
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchAll(query);
      setResults(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    search,
  };
}
