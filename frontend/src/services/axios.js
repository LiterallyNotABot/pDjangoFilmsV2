import axios from "axios";
import { config } from "../config";
import useUserStore from "../store/user/userStore";

// Utility function to retrieve token
function getStoredAccessToken() {
  return useUserStore.getState().token || localStorage.getItem("access_token");
}

// Axios instance
const api = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

// --- Cancel duplicate requests --- //
const controllerMap = new Map();

api.interceptors.request.use((request) => {
  const method = request.method?.toLowerCase();
  const paramsKey =
    method === "get" ? JSON.stringify(request.params || {}) : "";
  const dataKey = method !== "get" ? JSON.stringify(request.data || {}) : "";
  const urlKey = `${method || "get"}:${request.url}:${paramsKey}:${dataKey}`;

  // Abort previous matching request
  if (controllerMap.has(urlKey)) {
    controllerMap.get(urlKey).abort();
  }

  const controller = new AbortController();
  request.signal = controller.signal;
  controllerMap.set(urlKey, controller);

  // Custom headers
  request.headers["X-Internal-Access"] = "DjangoFilmsFrontend";

  // Auth header
  const token = getStoredAccessToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

// --- Handle responses and token refresh --- //
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const paramsKey =
      method === "get" ? JSON.stringify(response.config.params || {}) : "";
    const urlKey = `${method}:${response.config.url}:${paramsKey}`;

    controllerMap.delete(urlKey);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const method = originalRequest?.method?.toLowerCase();
    const paramsKey =
      method === "get" ? JSON.stringify(originalRequest?.params || {}) : "";
    const urlKey = `${method}:${originalRequest?.url}:${paramsKey}`;
    controllerMap.delete(urlKey);

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/jwt/create/") ||
      originalRequest?.url?.includes("/users/register/");

    if (isAuthRoute) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("Missing refresh token");

        const res = await axios.post(`${config.BASE_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);

        const user = JSON.parse(localStorage.getItem("user"));
        useUserStore.getState().setUser(user, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject({ ...refreshError, custom: "session_expired" });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
