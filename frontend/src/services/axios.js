import axios from "axios";
import { config } from "../config";
import useUserStore from "../store/user/userStore";

// Utility function for token retrieval
function getStoredAccessToken() {
  return useUserStore.getState().token || localStorage.getItem("access_token");
}

// Create Axios instance
const api = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

// --- Cancel duplicate requests by URL --- //
const controllerMap = new Map();

api.interceptors.request.use((request) => {
  const urlKey =
    request.url + (request.method === "get" ? JSON.stringify(request.params || {}) : "");

  // Abort previous request to same URL (optionally with params for GET)
  if (controllerMap.has(urlKey)) {
    controllerMap.get(urlKey).abort();
  }

  const controller = new AbortController();
  request.signal = controller.signal;
  controllerMap.set(urlKey, controller);

  // Attach custom header
  request.headers["X-Internal-Access"] = "DjangoFilmsFrontend";

  // Attach token
  const token = getStoredAccessToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

// --- Response Interceptor: Token refresh and cleanup --- //
api.interceptors.response.use(
  (response) => {
    const urlKey =
      response.config.url +
      (response.config.method === "get"
        ? JSON.stringify(response.config.params || {})
        : "");

    controllerMap.delete(urlKey);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    const urlKey =
      originalRequest?.url +
      (originalRequest?.method === "get"
        ? JSON.stringify(originalRequest?.params || {})
        : "");

    controllerMap.delete(urlKey);

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/jwt/create/") ||
      originalRequest?.url?.includes("/users/register/");

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // Handle expired token (401)
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

        // Rehydrate store
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
