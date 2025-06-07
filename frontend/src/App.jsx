import { useEffect } from "react";
import useUserStore from "./store/user/userStore";
import useFilmActivityStore from "./store/film/useFilmActivityStore";
import AppRoutes from "./routes";

export default function App() {
  useEffect(() => {
    useUserStore.getState().loadUserFromStorage();
    useFilmActivityStore.getState().loadActivityFromStorage();
  }, []);

  return <AppRoutes />;
}
