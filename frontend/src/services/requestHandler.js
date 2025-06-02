import api from "./axios";
import { handleApiError } from "./exceptionHelper";

export const fetchData = async (url, { params = {}, signal = null } = {}) => {
  try {
    const res = await api.get(url, { params, signal });
    return res.data;
  } catch (err) {
    if (err?.code === "ERR_CANCELED") {
      return null;
    }
    console.error("[fetchData] RAW error:", err);
    throw handleApiError(err);
  }
};
