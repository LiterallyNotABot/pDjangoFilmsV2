import api from "../axios";
import { handleApiError } from "../exceptionHelper";

export const loginUser = async (username, password) => {
  try {
    const res = await api.post("/auth/jwt/create/", { username, password });

    const { access, refresh } = res.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    const userRes = await api.get("/users/me/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    return {
      user: userRes.data,
      token: access,
    };
  } catch (err) {
    throw handleApiError(err);
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const res = await api.post("/users/register/", {
      username,
      email,
      password,
    });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
