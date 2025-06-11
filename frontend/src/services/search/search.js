import { fetchData } from "../requestHandler";
import { handleApiError } from "../exceptionHelper";

export async function searchAll(query, options = {}) {
  if (!query?.trim()) return [];

  try {
    const data = await fetchData("/search/", {
      params: { q: query },
      ...options,
    });

    return data;
  } catch (err) {
    console.error("[searchAll] Search failed:", err);
    throw handleApiError(err);
  }
}
