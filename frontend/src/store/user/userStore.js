import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  token: null,
  hydrated: false,

  setUser: (user, token) => {
    set({ user, token, hydrated: true });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access_token", token);
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, token: null, hydrated: true });
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      set({ user, token, hydrated: true });
    } else {
      set({ user: null, token: null, hydrated: true });
    }
  },
}));

export default useUserStore;
