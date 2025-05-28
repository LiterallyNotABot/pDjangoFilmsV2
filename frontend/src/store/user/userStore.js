import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  token: null,

  setUser: (user, token) => {
    set({ user, token });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", token);
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, token: null });
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      set({ user, token });
    }
  },
}));

export default useUserStore;
