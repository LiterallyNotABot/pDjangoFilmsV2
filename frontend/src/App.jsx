import { useEffect } from "react";
import useUserStore from "./store/user/userStore";
import AppRoutes from "./routes";

export default function App() {
  useEffect(() => {
    useUserStore.getState().loadUserFromStorage();
  }, []);

  return <AppRoutes />;
}
