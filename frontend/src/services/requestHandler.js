import api from "./axios";
import { handleApiError } from "./exceptionHelper";

export const fetchData = async (url, { params = {}, signal = null } = {}) => {
  try {
    const res = await api.get(url, { params, signal });
    return res.data;
  } catch (err) {
    if (err?.code === "ERR_CANCELED") return null;
    console.error("[fetchData] RAW error:", err);
    throw handleApiError(err);
  }
};

export const postData = async (url, payload = {}, { signal = null } = {}) => {
  try {
    const res = await api.post(url, payload, { signal });
    return res.data;
  } catch (err) {
    if (err?.code === "ERR_CANCELED") return null;
    console.error("[postData] RAW error:", err);
    throw handleApiError(err);
  }
};

export const patchData = async (url, payload = {}, { signal = null } = {}) => {
  try {
    const res = await api.patch(url, payload, { signal });
    return res.data;
  } catch (err) {
    if (err?.code === "ERR_CANCELED") return null;
    console.error("[patchData] RAW error:", err);
    throw handleApiError(err);
  }
};

export const putData = async (url, payload = {}, { signal = null } = {}) => {
  try {
    const res = await api.put(url, payload, { signal });
    return res.data;
  } catch (err) {
    if (err?.code === "ERR_CANCELED") return null;
    console.error("[putData] RAW error:", err);
    throw handleApiError(err);
  }
};

export const deleteData = async (url, { params = {}, signal = null } = {}) => {
  try {
    const res = await api.delete(url, { params, signal });
    return res.data;
  } catch (err) {
    if (err?.code === "ERR_CANCELED") return null;
    console.error("[deleteData] RAW error:", err);
    throw handleApiError(err);
  }
};
