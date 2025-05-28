import axios from "axios";
import { config } from "../config";
import useUserStore from "../store/user/userStore";

const api = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((request) => {
  request.headers["X-Internal-Access"] = "DjangoFilmsFrontend";

  const token = useUserStore.getState().token || localStorage.getItem("access_token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⚠️ No interceptar errores del login
    if (originalRequest?.url?.includes("/auth/jwt/create/")) {
      return Promise.reject(error);
    }

    // ⚠️ No interceptar errores del registro u otros públicos
    if (originalRequest?.url?.includes("/users/register/")) {
      return Promise.reject(error);
    }

    // Si es 401 y no ha sido reintentado, intenta refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

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
